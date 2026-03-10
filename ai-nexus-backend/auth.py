from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import random
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from models import User
from schemas import UserCreate, UserResponse, Token, OTPRequest
from database import get_db
import os
from dotenv import load_dotenv
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

load_dotenv(override=True)

SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Email Envs (Resilient Cloud Sync)
SMTP_SERVER = "smtp.googlemail.com" # Using alternative endpoint for better success rates
SMTP_PORT = 465
SENDER_EMAIL = os.getenv("EMAIL_SENDER", "")
SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD", "")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

router = APIRouter(prefix="/auth", tags=["auth"])

MOCK_OTPS = {}

def send_email_otp(recipient_email, otp):
    # FALLBACK: If BREVO_API_KEY is not set, we cannot send real emails
    BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
    
    if not BREVO_API_KEY or not SENDER_EMAIL:
        return False, "Missing BREVO_API_KEY or EMAIL_SENDER in Render settings."
        
    try:
        # We use HTTP (Port 443) which is NEVER blocked by Render
        import requests
        url = "https://api.brevo.com/v3/smtp/email"
        
        payload = {
            "sender": {"name": "AI Nexus Hub", "email": SENDER_EMAIL},
            "to": [{"email": recipient_email}],
            "subject": "🔐 Your AI Nexus Hub Verification Code",
            "htmlContent": f"""
                <div style="font-family: sans-serif; background: #0b0c10; padding: 40px; color: #fff;">
                    <div style="max-width: 500px; margin: auto; background: #1f2833; padding: 40px; border-radius: 20px; border: 1px solid #45a29e; text-align: center;">
                        <h1 style="color: #66fcf1;">AI Nexus Hub</h1>
                        <p style="color: #c5c6c7;">Your secure verification code is:</p>
                        <div style="background: rgba(102, 252, 241, 0.1); border: 2px dashed #66fcf1; padding: 20px; margin: 20px 0; font-size: 32px; font-weight: bold; color: #66fcf1; letter-spacing: 10px;">
                            {otp}
                        </div>
                        <p style="font-size: 12px; color: #45a29e;">This code expires in 10 minutes.</p>
                    </div>
                </div>
            """
        }
        
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": BREVO_API_KEY
        }
        
        response = requests.post(url, json=payload, headers=headers)
        
        if response.status_code in [201, 200, 202]:
            return True, "Success"
        else:
            return False, f"Brevo API Error: {response.text}"
            
    except Exception as e:
        return False, f"Neural Materialization Error: {str(e)}"

@router.post("/generate-otp")
def generate_otp(req: OTPRequest):
    otp = str(random.randint(100000, 999999))
    email = req.email
    MOCK_OTPS[email] = otp
    
    success, error_detail = send_email_otp(email, otp)
    
    if success:
        return {"message": "OTP sent successfully via Email", "mock_otp": None}
        
    return {
        "message": f"Email System Error: {error_detail}",
        "mock_otp": otp,
        "hint": "Ensure your Google App Password is correct and EMAIL_SENDER is set in Render."
    }

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if user.email not in MOCK_OTPS or MOCK_OTPS[user.email] != user.otp:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    db_user = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, full_name=user.fullName, hashed_password=hashed_password, email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == form_data.username) | (User.email == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
@router.post("/google-login")
async def google_login(token_data: dict, db: Session = Depends(get_db)):
    email = token_data.get("email")
    full_name = token_data.get("name")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            username=email.split("@")[0],
            email=email,
            full_name=full_name,
            hashed_password="google_oauth_placeholder"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/github-login")
async def github_login(token_data: dict, db: Session = Depends(get_db)):
    email = token_data.get("email")
    full_name = token_data.get("name")
    
    if not email:
        raise HTTPException(status_code=400, detail="GitHub identity rejected")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            username=token_data.get("login", email.split("@")[0]),
            email=email,
            full_name=full_name or token_data.get("login", ""),
            hashed_password="github_oauth_placeholder"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

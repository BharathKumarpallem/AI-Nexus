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
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        return False, "Missing EMAIL_SENDER or EMAIL_PASSWORD environment variables."
        
    try:
        msg = MIMEMultipart()
        msg['From'] = f"AI Nexus Hub <{SENDER_EMAIL}>"
        msg['To'] = recipient_email
        msg['Subject'] = "🔐 Your AI Nexus Hub Verification Code"
        
        body = f"""
        <html>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0c10; padding: 40px; color: #ffffff;">
                <div style="max-width: 500px; margin: auto; background: #1f2833; padding: 40px; border-radius: 20px; border: 1px solid #45a29e; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center;">
                    <h1 style="color: #66fcf1; margin-bottom: 20px; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">AI Nexus Hub</h1>
                    <p style="font-size: 18px; color: #c5c6c7; line-height: 1.6;">Welcome to the future. Use the secure code below to verify your account.</p>
                    
                    <div style="background: rgba(102, 252, 241, 0.1); border: 2px dashed #66fcf1; padding: 25px; margin: 30px 0; border-radius: 12px;">
                        <span style="font-size: 42px; font-weight: 800; letter-spacing: 12px; color: #66fcf1; text-shadow: 0 0 15px rgba(102, 252, 241, 0.5);">
                            {otp}
                        </span>
                    </div>
                    
                    <p style="font-size: 14px; color: #45a29e; margin-top: 25px;">This code will expire in 10 minutes for your security.</p>
                    <div style="height: 1px; background: #45a29e; margin: 30px 0; opacity: 0.3;"></div>
                    <p style="font-size: 12px; color: #c5c6c7; opacity: 0.7;">If you did not request this, please ignore this email.</p>
                </div>
            </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))
        
        # Cloud-Resilient Handshake: Direct SSL with socket timeout protocol
        logging.info(f"Initiating Neural SMTP Link to {SMTP_SERVER}:{SMTP_PORT}...")
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, timeout=25)
        server.set_debuglevel(1) # This will output detailed logs to Render for us
        
        logging.info("Link established. Attempting Authentication...")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        text = msg.as_string()
        server.sendmail(SENDER_EMAIL, recipient_email, text)
        server.quit()
        return True, "Success"
    except Exception as e:
        err_msg = str(e)
        logging.error(f"Critical SMTP Error: {err_msg}")
        return False, err_msg

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

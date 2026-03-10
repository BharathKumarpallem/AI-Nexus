from pydantic import BaseModel
from datetime import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    email: str
    otp: str
    fullName: str

class OTPRequest(BaseModel):
    email: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatCreate(BaseModel):
    role: str
    prompt: str

class ChatResponse(BaseModel):
    id: int
    role: str
    prompt: str
    response: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

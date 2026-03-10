from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String)

    chats = relationship("Chat", back_populates="owner")

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String, index=True)
    prompt = Column(String)
    response = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="chats")

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from database import get_db
from models import Chat, User
from schemas import ChatCreate, ChatResponse
from auth import get_current_user
from gemini_service import generate_ai_response, ROLE_PROMPTS, generate_image_prompt
import requests

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=ChatResponse)
def create_chat(chat: ChatCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if chat.role not in ROLE_PROMPTS:
        raise HTTPException(status_code=400, detail="Invalid role selected")
        
    # Fetch recent conversation history (last 5 messages)
    history_records = db.query(Chat).filter(
        Chat.user_id == current_user.id,
        Chat.role == chat.role
    ).order_by(Chat.timestamp.desc()).limit(5).all()
    
    # Format history for the prompt
    history_str = ""
    for record in reversed(history_records):
        history_str += f"User: {record.prompt}\nAssistant: {record.response}\n\n"
        
    if chat.role == "agriculture":
        try:
            # Default to a general region if no location provided (Demo implementation)
            w_res = requests.get("https://api.open-meteo.com/v1/forecast?latitude=17.3850&longitude=78.4867&current_weather=true").json()
            curr = w_res.get("current_weather", {})
            weather_data = f"\n\n[LIVE WEATHER UPDATE: Temp: {curr.get('temperature')}°C, WindSpeed: {curr.get('windspeed')}km/h]"
            chat.prompt += f" (Note to AI: Use this experimental live weather data: {weather_data})"
        except:
            pass

    ai_response = generate_ai_response(chat.role, chat.prompt, history_str)
    
    new_chat = Chat(
        user_id=current_user.id,
        role=chat.role,
        prompt=chat.prompt,
        response=ai_response
    )
    
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    
    return new_chat

@router.get("/history", response_model=List[ChatResponse])
def get_chat_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    chats = db.query(Chat).filter(Chat.user_id == current_user.id).order_by(Chat.timestamp.asc()).all()
    return chats

@router.post("/image")
def get_image_idea(req: ChatCreate, current_user: User = Depends(get_current_user)):
    # This refines a user request into a professional image prompt
    refined_prompt = generate_image_prompt(req.prompt)
    return {
        "original": req.prompt,
        "refined_prompt": refined_prompt,
        "message": "Image section is ready to generate high-quality visuals."
    }

from fastapi import FastAPI, Query, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import models
from database import engine
from auth import router as auth_router
from chat import router as chat_router

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Nexus Hub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, you should specify the Vercel URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Nexus Hub Backend!"}

@app.get("/weather")
def get_weather(lat: float = 17.3850, lon: float = 78.4867):
    # Default to Hyderabad, India if not provided
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    try:
        response = requests.get(url)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

from fastapi import FastAPI, Query
# ... existing imports ...

@app.post("/generate-image")
def generate_image_api(prompt: str = Query(...)):
    # Refine raw user intent into a high-fidelity cinematic prompt
    from gemini_service import generate_image_prompt
    refined_materialization = generate_image_prompt(prompt)
    print(f"--- [NEURAL VISION] SYNTHESIZING: {refined_materialization[:100]}... ---")
    
    # Direct high-stability generation endpoint using the REFINED prompt
    # Using quote_plus for deeper encoding stability in URL parameters
    from urllib.parse import quote_plus
    import random
    safe_prompt = quote_plus(refined_materialization)
    raw_url = f"https://image.pollinations.ai/prompt/{safe_prompt}?width=1024&height=1024&nologo=true&enhance=true&seed={random.randint(0, 999999)}"
    
    import os
    base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
    proxy_url = f"{base_url}/image-proxy?url={requests.utils.quote(raw_url)}"
    return {"image_url": proxy_url}

@app.get("/image-proxy")
def image_proxy(url: str):
    import requests
    from urllib.parse import unquote
    
    target_url = unquote(url)
    print(f"--- [NEURAL PROXY] MATERIALIZING: {target_url[:80]}... ---")
    
    try:
        # High-fidelity browser headers to ensure visual handshake stability
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'DNT': '1'
        }
        
        # Follow redirects and handle longer timeouts for generative materialization
        res = requests.get(target_url, timeout=35, allow_redirects=True, headers=headers)
        
        # Verify content-type and status
        content_type = res.headers.get("content-type", "image/jpeg")
        
        if res.status_code != 200 or "text/html" in content_type:
            print(f"--- [NEURAL PROXY] CALIBRATING FALLBACK | STATUS: {res.status_code} ---")
            # Thematic fallback high-res visual
            fallback_url = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200"
            fb_res = requests.get(fallback_url, timeout=10)
            return Response(content=fb_res.content, media_type="image/jpeg", headers={"Access-Control-Allow-Origin": "*"})

        return Response(
            content=res.content, 
            media_type=content_type,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Cache-Control": "public, max-age=31536000",
                "X-Content-Type-Options": "nosniff"
            }
        )
    except Exception as e:
        print(f"--- [NEURAL PROXY] CRITICAL RECOVERY: {str(e)} ---")
        return Response(content=f"Neural materialization failed: {str(e)}", status_code=500)

@app.get("/search-images")
def search_images(query: str):
    # Simulated search using high-fidelity CDN URLs routed through the Nexus proxy
    import requests
    search_q = requests.utils.quote(query)
    import os
    base_url = os.getenv("API_BASE_URL", "http://localhost:8000")
    image_urls = [
        f"{base_url}/image-proxy?url={requests.utils.quote(f'https://source.unsplash.com/featured/800x600?{search_q if i==0 else search_q + str(i)}&sig={i}')}"
        for i in range(4)
    ]
    return {"images": image_urls}

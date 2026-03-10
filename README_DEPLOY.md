# AI Nexus Hub - Deployment Guide

To get a live URL for your website, follow these steps to deploy both the backend and frontend.

## 1. Push to GitHub
If you haven't already, create a new repository on GitHub and push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 2. Deploy Backend (Render.com)
Render is a great platform for FastAPI apps.

1. **Sign up** at [Render.com](https://render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. Set the following configurations:
   - **Name:** `ai-nexus-backend`
   - **Environment:** `Python 3`
   - **Root Directory:** `ai-nexus-backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `SECRET_KEY`: A long random string for JWT.
   - `API_BASE_URL`: The URL Render gives you (e.g., `https://ai-nexus-backend.onrender.com`).

---

## 3. Deploy Frontend (Vercel.com)
Vercel is the best for React/Vite apps.

1. **Sign up** at [Vercel.com](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. Set the following configurations:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `ai-nexus-frontend`
5. **Environment Variables**:
   - `VITE_API_URL`: The URL you got from Render (e.g., `https://ai-nexus-backend.onrender.com`).
6. Click **Deploy**.

---

## 4. Final Handshake
Once both are deployed:
1. Go to your **Render** dashboard.
2. Update the `API_BASE_URL` to the Render URL itself.
3. (Optional) In `main.py`, you can change `allow_origins=["*"]` to your specific Vercel URL for better security.

**Note:** Since we are using SQLite, data will disappear when the Render server restarts or sleeps (Free tier). For permanent storage, consider attaching a Render Disk Volume or using a managed PostgreSQL database.

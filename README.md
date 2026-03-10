# AI Nexus Hub

A multi-role full-stack AI platform built with FastAPI, JWT authentication, SQL database, and a fully animated physics-based React frontend. 

## Features
- **Backend:** FastAPI, Python, SQLite + SQLAlchemy, JWT authentication, Gemini Pro API integration.
- **Frontend:** React + Vite, Custom Physics Animation (no external libraries like matter.js), Pure CSS components with glassmorphism and neon styles.
- **Roles:** Easily toggle between 6 distinct AI personas (Education, Agriculture, Career, Health, Coding, Research).

## Impact Line
“Developed AI Nexus Hub – a multi-role AI platform built with FastAPI, JWT authentication, SQL database, and a fully animated physics-based React frontend.”

## Setup Instructions

### 1. Backend

1. Navigate to the backend folder:
   ```bash
   cd ai-nexus-backend
   ```
2. Create virtual environment and install dependencies:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file or modify the existing one and put your `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY="your-gemini-key"
   SECRET_KEY="your-secret-key-123"
   ```
4. Run the development server:
   ```bash
   uvicorn main:app --reload
   # Runs on http://localhost:8000
   ```

### 2. Frontend

1. Navigate to the frontend folder:
   ```bash
   cd ai-nexus-frontend
   ```
2. Install dependencies (React + React Router DOM):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
  ```

Enjoy pure CSS and JS physics AI integrations!

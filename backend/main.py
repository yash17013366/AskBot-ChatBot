"""Main FastAPI application for AskBot."""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure both project root and backend dir are in sys.path
backend_dir = Path(__file__).resolve().parent
project_root = backend_dir.parent
for p in [str(project_root), str(backend_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Load environment variables if .env is present
load_dotenv()

try:
    from backend.routes.connection import router as connection_router
    from backend.routes.chat import router as chat_router
except ModuleNotFoundError:
    from routes.connection import router as connection_router
    from routes.chat import router as chat_router

app = FastAPI(
    title="AskBot API",
    description="Backend service for AskBot AI Chatbot",
    version="1.0.0"
)

# CORS Configuration
frontend_origin_env = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
# Support comma-separated origins if provided (e.g. "http://localhost:5173,https://askbot-frontend.vercel.app")
allowed_origins = [origin.strip() for origin in frontend_origin_env.split(",") if origin.strip()]

# Always include default local Vite dev origins for reliable local pairing
for default_local in ["http://localhost:5173", "http://127.0.0.1:5173"]:
    if default_local not in allowed_origins:
        allowed_origins.append(default_local)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(connection_router)
app.include_router(chat_router)


@app.get("/api/health", tags=["health"])
def health_check():
    """Health check endpoint to verify backend availability."""
    return {
        "status": "healthy",
        "service": "AskBot Backend",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

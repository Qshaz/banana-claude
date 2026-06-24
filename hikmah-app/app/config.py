import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-to-a-random-string")
    APP_URL: str = os.getenv("APP_URL", "http://localhost:8080")
    DATA_DIR: str = os.getenv("DATA_DIR", "./data")
    CHROMA_DIR: str = os.path.join(os.getenv("DATA_DIR", "./data"), "chromadb")
    BOOKS_FILE: str = os.path.join(os.getenv("DATA_DIR", "./data"), "books.json")

    GOOGLE_SCOPES = [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/drive.readonly",
    ]

settings = Settings()

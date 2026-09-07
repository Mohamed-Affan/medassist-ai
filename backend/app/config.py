from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "MedAssist AI API"
    API_V1_STR: str = "/api/v1"
    # Required: never commit a signing key. See .env.example for local setup.
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SQLite Database URL
    DATABASE_URL: str = "sqlite:///./medassist_ai.db"
    
    # Allowed CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # React default
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

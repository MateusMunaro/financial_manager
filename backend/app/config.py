from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Aplicação
    APP_NAME: str = "Financial Manager API"
    DEBUG: bool = False  # Produção
    API_VERSION: str = "v1"
    
    # Segurança
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Banco de Dados
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./financial_manager.db")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "https://financial-manager-nine.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

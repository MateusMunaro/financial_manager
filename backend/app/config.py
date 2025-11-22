from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Aplicação
    APP_NAME: str = "Financial Manager API"
    DEBUG: bool = False  # Produção
    API_VERSION: str = "v1"
    
    # Segurança
    SECRET_KEY: str = os.getenv("SECRET_KEY", "default-secret-key-change-in-production-very-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Banco de Dados
    # Vercel não suporta SQLite (filesystem read-only)
    # Use PostgreSQL: Vercel Postgres, Neon, Supabase, etc.
    # Formato: postgresql://user:password@host:port/database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        os.getenv("POSTGRES_URL", "sqlite:///./financial_manager.db")  # fallback para dev local
    )
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "https://financial-manager-nine.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Permitir variáveis extras


settings = Settings()

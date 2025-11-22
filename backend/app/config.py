from pydantic_settings import BaseSettings
from typing import List
import os


def get_database_url() -> str:
    """Obtém a URL do banco de dados com conversão automática postgres:// -> postgresql://"""
    url = os.getenv("POSTGRES_URL") or os.getenv("DATABASE_URL")
    
    if not url:
        raise ValueError("❌ POSTGRES_URL ou DATABASE_URL não configurada! Configure no painel da Vercel.")
    
    # Supabase e algumas plataformas usam postgres://, mas SQLAlchemy precisa de postgresql://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    
    return url


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
    # OBRIGATÓRIO: PostgreSQL (Vercel Postgres, Neon, Supabase, etc.)
    # Formato: postgresql://user:password@host:port/database
    DATABASE_URL: str = get_database_url()
    
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

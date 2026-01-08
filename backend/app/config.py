from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

# Carrega o .env ANTES de qualquer configuração
load_dotenv()


def get_database_url() -> str:
    """Obtém a URL do banco de dados da integração Supabase"""
    url = os.getenv("STORAGE_POSTGRES_URL_NON_POOLING")
    
    if not url:
        raise ValueError("❌ STORAGE_POSTGRES_URL não encontrada! Certifique-se que a integração Supabase está configurada na Vercel.")
    
    # Supabase usa postgres://, mas SQLAlchemy precisa de postgresql://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    
    return url


class Settings(BaseSettings):
    # Aplicação
    APP_NAME: str = "Financial Manager API"
    DEBUG: bool = False  # Produção
    API_VERSION: str = "v1"
    
    # Segurança - Usando JWT Secret do Supabase
    SECRET_KEY: str = os.getenv("STORAGE_SUPABASE_JWT_SECRET", "fallback-secret-key-please-configure-supabase")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Banco de Dados
    # OBRIGATÓRIO: PostgreSQL (Vercel Postgres, Neon, Supabase, etc.)
    # Formato: postgresql://user:password@host:port/database
    DATABASE_URL: str = get_database_url()
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "https://financial-manager-nine.vercel.app",
        "https://financial-manager-rbafx3324-mateusmunaros-projects.vercel.app",  # Preview/Dev deployments
        "http://localhost:3000",
        "http://localhost:5173",
    ]
    
    # Apple OAuth
    APPLE_CLIENT_ID: str = os.getenv("APPLE_CLIENT_ID", "")  # Services ID
    APPLE_TEAM_ID: str = os.getenv("APPLE_TEAM_ID", "")
    APPLE_KEY_ID: str = os.getenv("APPLE_KEY_ID", "")
    APPLE_PRIVATE_KEY: str = os.getenv("APPLE_PRIVATE_KEY", "")  # Conteúdo do arquivo .p8
    APPLE_REDIRECT_URI: str = os.getenv(
        "APPLE_REDIRECT_URI", 
        "https://financial-manager-nine.vercel.app/api/auth/apple/callback"
    )
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Permitir variáveis extras


settings = Settings()

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Aplicação
    APP_NAME: str = "Financial Manager API"
    DEBUG: bool = True
    API_VERSION: str = "v1"
    
    # Segurança
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Banco de Dados
    DATABASE_URL: str = "sqlite:///./financial_manager.db"
    
    # CORS
    CORS_ORIGINS: List[str] = ["https://financial-manager-nine.vercel.app"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

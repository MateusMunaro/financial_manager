from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.router import api_router
import os

# Importar modelos e database
try:
    from app.database import engine, Base
    from app.models import (
        User, 
        Expense, 
        PaymentMethod, 
        RecurringExpense, 
        Investment, 
        InvestmentHistory
    )
    
    # Criar tabelas do banco de dados no PostgreSQL
    print("🔄 Criando tabelas no banco de dados...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tabelas criadas com sucesso!")
except Exception as e:
    print(f"❌ Erro ao criar tabelas: {e}")
    import traceback
    traceback.print_exc()
    # Não falhar a aplicação, mas logar o erro

# Criar aplicação FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="API para gerenciamento financeiro pessoal",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir router da API v1
app.include_router(api_router, prefix=f"/api/{settings.API_VERSION}")


@app.get("/")
async def root():
    """Endpoint raiz."""
    return {
        "message": "Financial Manager API",
        "version": settings.API_VERSION,
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Verificar saúde da API."""
    return {
        "status": "healthy",
        "version": settings.API_VERSION,
        "database": "PostgreSQL",
        "database_url_prefix": settings.DATABASE_URL[:25] + "..." if len(settings.DATABASE_URL) > 25 else settings.DATABASE_URL,
    }

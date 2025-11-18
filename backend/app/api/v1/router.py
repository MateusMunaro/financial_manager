from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    expenses,
    payment_methods,
    recurring_expenses,
    investments,
    dashboard,
)

api_router = APIRouter()

# Incluir todos os routers
api_router.include_router(auth.router)
api_router.include_router(expenses.router)
api_router.include_router(payment_methods.router)
api_router.include_router(recurring_expenses.router)
api_router.include_router(investments.router)
api_router.include_router(dashboard.router)

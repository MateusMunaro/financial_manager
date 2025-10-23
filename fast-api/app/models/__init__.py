# Importar todos os modelos para garantir que sejam registrados com Base
from app.models.user import User
from app.models.expense import Expense
from app.models.payment_method import PaymentMethod
from app.models.recurring_expense import RecurringExpense
from app.models.investment import Investment, InvestmentHistory

__all__ = [
    "User",
    "Expense",
    "PaymentMethod",
    "RecurringExpense",
    "Investment",
    "InvestmentHistory",
]

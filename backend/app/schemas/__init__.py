# Importar todos os schemas
from app.schemas.auth import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    ChangePassword,
    Token,
    AuthResponse,
    MessageResponse,
)
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseFilters,
    ExpenseStats,
    PaymentMethodType,
    Period,
)
from app.schemas.payment_method import (
    PaymentMethodCreate,
    PaymentMethodUpdate,
    PaymentMethodResponse,
)
from app.schemas.recurring_expense import (
    RecurringExpenseCreate,
    RecurringExpenseUpdate,
    RecurringExpenseResponse,
    RecurringFrequency,
    GenerateExpensesRequest,
)
from app.schemas.investment import (
    InvestmentCreate,
    InvestmentUpdate,
    InvestmentResponse,
    InvestmentFilters,
    InvestmentStats,
    InvestmentHistoryResponse,
    InvestmentType,
    UpdateCurrentValueRequest,
)
from app.schemas.dashboard import (
    DashboardData,
    FinancialSummary,
    RecentTransaction,
    CategorySpending,
    MonthlyTrend,
)

__all__ = [
    # Auth
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserResponse",
    "ChangePassword",
    "Token",
    "AuthResponse",
    "MessageResponse",
    # Expense
    "ExpenseCreate",
    "ExpenseUpdate",
    "ExpenseResponse",
    "ExpenseFilters",
    "ExpenseStats",
    "PaymentMethodType",
    "Period",
    # Payment Method
    "PaymentMethodCreate",
    "PaymentMethodUpdate",
    "PaymentMethodResponse",
    # Recurring Expense
    "RecurringExpenseCreate",
    "RecurringExpenseUpdate",
    "RecurringExpenseResponse",
    "RecurringFrequency",
    "GenerateExpensesRequest",
    # Investment
    "InvestmentCreate",
    "InvestmentUpdate",
    "InvestmentResponse",
    "InvestmentFilters",
    "InvestmentStats",
    "InvestmentHistoryResponse",
    "InvestmentType",
    "UpdateCurrentValueRequest",
    # Dashboard
    "DashboardData",
    "FinancialSummary",
    "RecentTransaction",
    "CategorySpending",
    "MonthlyTrend",
]

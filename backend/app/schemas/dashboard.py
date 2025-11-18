from typing import List
from pydantic import BaseModel
from app.schemas.expense import Period


class FinancialChangePercentage(BaseModel):
    balance: float
    income: float
    expenses: float
    investments: float


class FinancialSummary(BaseModel):
    total_balance: float
    total_income: float
    total_expenses: float
    total_investments: float
    period: Period
    change_percentage: FinancialChangePercentage


class RecentTransaction(BaseModel):
    id: str
    name: str
    value: float
    date: str
    category: str
    type: str  # 'income' or 'expense'


class CategorySpending(BaseModel):
    category: str
    value: float
    percentage: float
    limit: float = None
    color: str


class MonthlyTrend(BaseModel):
    month: str
    income: float
    expenses: float


class DashboardData(BaseModel):
    summary: FinancialSummary
    recent_transactions: List[RecentTransaction]
    category_spending: List[CategorySpending]
    monthly_trend: List[MonthlyTrend]

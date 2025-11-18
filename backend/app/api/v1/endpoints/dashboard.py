from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.expense import Expense
from app.models.investment import Investment
from app.schemas.dashboard import (
    DashboardData,
    FinancialSummary,
    RecentTransaction,
    CategorySpending,
    MonthlyTrend,
    FinancialChangePercentage,
)
from app.schemas.expense import Period
from app.core.utils import calculate_percentage_change

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardData)
async def get_dashboard(
    period: Period = Query(Period.MONTH),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter dados completos do dashboard."""
    summary = await get_summary(period, current_user, db)
    recent = await get_recent_transactions(10, current_user, db)
    categories = await get_category_spending(period, current_user, db)
    trend = await get_monthly_trend(6, current_user, db)
    
    return DashboardData(
        summary=summary,
        recent_transactions=recent,
        category_spending=categories,
        monthly_trend=trend,
    )


@router.get("/summary", response_model=FinancialSummary)
async def get_summary(
    period: Period = Query(Period.MONTH),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter resumo financeiro."""
    # Calcular período
    end_date = datetime.utcnow()
    if period == Period.DAY:
        start_date = end_date - timedelta(days=1)
    elif period == Period.WEEK:
        start_date = end_date - timedelta(weeks=1)
    elif period == Period.MONTH:
        start_date = end_date - timedelta(days=30)
    else:  # YEAR
        start_date = end_date - timedelta(days=365)
    
    # Buscar despesas
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id,
        Expense.date >= start_date,
        Expense.date <= end_date
    ).all()
    
    # Buscar investimentos
    investments = db.query(Investment).filter(Investment.user_id == current_user.id).all()
    
    total_expenses = sum(exp.value for exp in expenses)
    total_investments = sum(inv.current_value for inv in investments)
    total_income = 0.0  # TODO: Implementar quando houver modelo de receitas
    total_balance = total_income - total_expenses + total_investments
    
    # Calcular mudanças percentuais (simulado por enquanto)
    change_percentage = FinancialChangePercentage(
        balance=5.2,
        income=8.1,
        expenses=-3.4,
        investments=12.7,
    )
    
    return FinancialSummary(
        total_balance=total_balance,
        total_income=total_income,
        total_expenses=total_expenses,
        total_investments=total_investments,
        period=period,
        change_percentage=change_percentage,
    )


@router.get("/recent-transactions", response_model=List[RecentTransaction])
async def get_recent_transactions(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter transações recentes."""
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).order_by(Expense.date.desc()).limit(limit).all()
    
    transactions = []
    for exp in expenses:
        transactions.append(RecentTransaction(
            id=exp.id,
            name=exp.name,
            value=exp.value,
            date=exp.date.strftime("%d/%m/%Y"),
            category=exp.category,
            type="expense",
        ))
    
    return transactions


@router.get("/category-spending", response_model=List[CategorySpending])
async def get_category_spending(
    period: Period = Query(Period.MONTH),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter gastos por categoria."""
    end_date = datetime.utcnow()
    if period == Period.MONTH:
        start_date = end_date - timedelta(days=30)
    else:
        start_date = end_date - timedelta(days=365)
    
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id,
        Expense.date >= start_date,
        Expense.date <= end_date
    ).all()
    
    # Agrupar por categoria
    by_category = {}
    total = sum(exp.value for exp in expenses)
    
    for exp in expenses:
        cat = exp.category
        by_category[cat] = by_category.get(cat, 0.0) + exp.value
    
    # Criar resposta
    colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]
    categories = []
    
    for i, (cat, value) in enumerate(sorted(by_category.items(), key=lambda x: x[1], reverse=True)):
        percentage = (value / total * 100) if total > 0 else 0
        categories.append(CategorySpending(
            category=cat,
            value=value,
            percentage=percentage,
            color=colors[i % len(colors)],
        ))
    
    return categories


@router.get("/monthly-trend", response_model=List[MonthlyTrend])
async def get_monthly_trend(
    months: int = Query(6, ge=1, le=24),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter tendência mensal."""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30 * months)
    
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id,
        Expense.date >= start_date,
        Expense.date <= end_date
    ).all()
    
    # Agrupar por mês
    by_month = {}
    for exp in expenses:
        month_key = exp.date.strftime("%Y-%m")
        if month_key not in by_month:
            by_month[month_key] = {"income": 0.0, "expenses": 0.0}
        by_month[month_key]["expenses"] += exp.value
    
    # Criar resposta
    trend = []
    for month_key in sorted(by_month.keys()):
        month_name = datetime.strptime(month_key, "%Y-%m").strftime("%b/%Y")
        trend.append(MonthlyTrend(
            month=month_name,
            income=by_month[month_key]["income"],
            expenses=by_month[month_key]["expenses"],
        ))
    
    return trend

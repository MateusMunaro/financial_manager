from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
import time
import hashlib
from functools import wraps
from datetime import datetime
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseStats,
    PaymentMethodType,
    Period,
)



router = APIRouter(prefix="/expenses", tags=["Expenses"])


# Cache para rate limiting (armazena: {chave: timestamp_da_última_chamada})
_request_cache = {}
_RATE_LIMIT_SECONDS = 1  # Tempo mínimo entre requisições idênticas


def _generate_cache_key(user_id: str, endpoint: str, **kwargs) -> str:
    """Gera uma chave única para o cache baseada no usuário e parâmetros."""
    params_str = str(sorted(kwargs.items()))
    cache_string = f"{user_id}:{endpoint}:{params_str}"
    return hashlib.md5(cache_string.encode()).hexdigest()


def _is_rate_limited(cache_key: str) -> bool:
    """Verifica se a requisição deve ser bloqueada por rate limiting."""
    current_time = time.time()
    
    if cache_key in _request_cache:
        last_request_time = _request_cache[cache_key]
        time_diff = current_time - last_request_time
        
        if time_diff < _RATE_LIMIT_SECONDS:
            return True
    
    # Atualizar o cache com o tempo atual
    _request_cache[cache_key] = current_time
    
    # Limpar entradas antigas do cache (mais de 60 segundos)
    keys_to_remove = [
        key for key, timestamp in _request_cache.items()
        if current_time - timestamp > 60
    ]
    for key in keys_to_remove:
        del _request_cache[key]
    
    return False

@router.get("", response_model=List[ExpenseResponse])
async def get_expenses(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    category: Optional[str] = None,
    payment_method: Optional[PaymentMethodType] = None,
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    is_recurring: Optional[bool] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        cache_key = _generate_cache_key(
            user_id=str(current_user.id),
            endpoint="get_expenses",
            start_date=start_date,
            end_date=end_date,
            category=category,
            payment_method=payment_method,
            min_value=min_value,
            max_value=max_value,
            is_recurring=is_recurring,
            search=search,
        )
        
        # Verificar rate limiting
        if _is_rate_limited(cache_key):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Muitas requisições. Aguarde um momento antes de tentar novamente.",
            )
        
        query = db.query(Expense).filter(Expense.user_id == current_user.id)
        
        # Aplicar filtros
        if start_date:
            query = query.filter(Expense.date >= start_date)
        if end_date:
            query = query.filter(Expense.date <= end_date)
        if category:
            query = query.filter(Expense.category == category)
        if payment_method:
            query = query.filter(Expense.payment_method == payment_method)
        if min_value is not None:
            query = query.filter(Expense.value >= min_value)
        if max_value is not None:
            query = query.filter(Expense.value <= max_value)
        if is_recurring is not None:
            query = query.filter(Expense.is_recurring == is_recurring)
        if search:
            query = query.filter(
                or_(
                    Expense.name.ilike(f"%{search}%"),
                    Expense.description.ilike(f"%{search}%")
                )
            )
        
        expenses = query.order_by(Expense.date.desc()).all()
        return [ExpenseResponse.model_validate(expense) for expense in expenses]
    
    except HTTPException:
        # Re-lançar HTTPException (rate limit)
        raise
    except Exception as e:
        # Capturar qualquer outro erro inesperado
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro ao buscar despesas: {str(e)}",
        )


@router.get("/stats", response_model=ExpenseStats)
async def get_expense_stats(
    period: Period = Query(Period.MONTH),
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter estatísticas de despesas."""
    query = db.query(Expense).filter(Expense.user_id == current_user.id)
    
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    
    expenses = query.all()
    
    if not expenses:
        return ExpenseStats(
            total=0.0,
            count=0,
            average=0.0,
            by_category={},
            by_payment_method={},
            period=period,
        )
    
    total = sum(exp.value for exp in expenses)
    count = len(expenses)
    average = total / count if count > 0 else 0.0
    
    # Agrupar por categoria
    by_category = {}
    for expense in expenses:
        category = expense.category
        by_category[category] = by_category.get(category, 0.0) + expense.value
    
    # Agrupar por método de pagamento
    by_payment_method = {}
    for expense in expenses:
        if expense.payment_method:
            method = expense.payment_method.value
            by_payment_method[method] = by_payment_method.get(method, 0.0) + expense.value
    
    return ExpenseStats(
        total=total,
        count=count,
        average=average,
        by_category=by_category,
        by_payment_method=by_payment_method,
        period=period,
    )


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Buscar despesa por ID."""
    expense = db.query(Expense).filter(
        and_(Expense.id == expense_id, Expense.user_id == current_user.id)
    ).first()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Despesa não encontrada",
        )
    
    return ExpenseResponse.model_validate(expense)


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense_data: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Criar nova despesa."""
    db_expense = Expense(
        user_id=current_user.id,
        **expense_data.model_dump(),
    )
    
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    return ExpenseResponse.model_validate(db_expense)


@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: str,
    expense_data: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar despesa."""
    expense = db.query(Expense).filter(
        and_(Expense.id == expense_id, Expense.user_id == current_user.id)
    ).first()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Despesa não encontrada",
        )
    
    # Atualizar campos
    update_data = expense_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    db.commit()
    db.refresh(expense)
    
    return ExpenseResponse.model_validate(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deletar despesa."""
    expense = db.query(Expense).filter(
        and_(Expense.id == expense_id, Expense.user_id == current_user.id)
    ).first()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Despesa não encontrada",
        )
    
    db.delete(expense)
    db.commit()
    
    return None

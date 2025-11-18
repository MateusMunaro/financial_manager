from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.recurring_expense import RecurringExpense, RecurringFrequency
from app.models.expense import Expense
from app.schemas.recurring_expense import (
    RecurringExpenseCreate,
    RecurringExpenseUpdate,
    RecurringExpenseResponse,
    GenerateExpensesRequest,
)

router = APIRouter(prefix="/recurring-expenses", tags=["Recurring Expenses"])


@router.get("", response_model=List[RecurringExpenseResponse])
async def get_recurring_expenses(
    is_active: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Listar despesas recorrentes."""
    query = db.query(RecurringExpense).filter(RecurringExpense.user_id == current_user.id)
    
    if is_active is not None:
        query = query.filter(RecurringExpense.is_active == is_active)
    
    expenses = query.order_by(RecurringExpense.name).all()
    return [RecurringExpenseResponse.model_validate(exp) for exp in expenses]


@router.get("/{expense_id}", response_model=RecurringExpenseResponse)
async def get_recurring_expense(
    expense_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Buscar despesa recorrente por ID."""
    expense = db.query(RecurringExpense).filter(
        and_(RecurringExpense.id == expense_id, RecurringExpense.user_id == current_user.id)
    ).first()
    
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Despesa recorrente não encontrada")
    
    return RecurringExpenseResponse.model_validate(expense)


@router.post("", response_model=RecurringExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_recurring_expense(
    expense_data: RecurringExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Criar despesa recorrente."""
    db_expense = RecurringExpense(user_id=current_user.id, **expense_data.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return RecurringExpenseResponse.model_validate(db_expense)


@router.put("/{expense_id}", response_model=RecurringExpenseResponse)
async def update_recurring_expense(
    expense_id: str,
    expense_data: RecurringExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar despesa recorrente."""
    expense = db.query(RecurringExpense).filter(
        and_(RecurringExpense.id == expense_id, RecurringExpense.user_id == current_user.id)
    ).first()
    
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Despesa recorrente não encontrada")
    
    update_data = expense_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    db.commit()
    db.refresh(expense)
    return RecurringExpenseResponse.model_validate(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recurring_expense(
    expense_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deletar despesa recorrente."""
    expense = db.query(RecurringExpense).filter(
        and_(RecurringExpense.id == expense_id, RecurringExpense.user_id == current_user.id)
    ).first()
    
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Despesa recorrente não encontrada")
    
    db.delete(expense)
    db.commit()
    return None


@router.patch("/{expense_id}/toggle-active", response_model=RecurringExpenseResponse)
async def toggle_active(
    expense_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Ativar/desativar despesa recorrente."""
    expense = db.query(RecurringExpense).filter(
        and_(RecurringExpense.id == expense_id, RecurringExpense.user_id == current_user.id)
    ).first()
    
    if not expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Despesa recorrente não encontrada")
    
    expense.is_active = not expense.is_active
    db.commit()
    db.refresh(expense)
    return RecurringExpenseResponse.model_validate(expense)


@router.post("/{expense_id}/generate")
async def generate_expenses(
    expense_id: str,
    request: GenerateExpensesRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Gerar despesas a partir da recorrência."""
    recurring = db.query(RecurringExpense).filter(
        and_(RecurringExpense.id == expense_id, RecurringExpense.user_id == current_user.id)
    ).first()
    
    if not recurring:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Despesa recorrente não encontrada")
    
    start = request.start_date or datetime.utcnow()
    end = request.end_date or start + relativedelta(months=3)
    
    generated_count = 0
    current_date = start
    
    while current_date <= end:
        # Criar despesa
        expense = Expense(
            user_id=current_user.id,
            name=recurring.name,
            value=recurring.value,
            category=recurring.category,
            date=current_date,
            description=recurring.description,
            payment_method=recurring.payment_method,
            is_recurring=True,
        )
        db.add(expense)
        generated_count += 1
        
        # Calcular próxima data
        if recurring.frequency == RecurringFrequency.MONTHLY:
            current_date += relativedelta(months=1)
        elif recurring.frequency == RecurringFrequency.YEARLY:
            current_date += relativedelta(years=1)
        elif recurring.frequency == RecurringFrequency.WEEKLY:
            current_date += timedelta(weeks=1)
    
    db.commit()
    return {"message": f"{generated_count} despesas geradas com sucesso"}

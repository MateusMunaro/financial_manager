from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.investment import Investment, InvestmentHistory, InvestmentType
from app.schemas.investment import (
    InvestmentCreate,
    InvestmentUpdate,
    InvestmentResponse,
    InvestmentStats,
    InvestmentHistoryResponse,
    InvestmentTypeStats,
    UpdateCurrentValueRequest,
)

router = APIRouter(prefix="/investments", tags=["Investments"])


@router.get("", response_model=List[InvestmentResponse])
async def get_investments(
    type: Optional[InvestmentType] = None,
    min_value: Optional[float] = None,
    max_value: Optional[float] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Listar investimentos."""
    query = db.query(Investment).filter(Investment.user_id == current_user.id)
    
    if type:
        query = query.filter(Investment.type == type)
    if min_value is not None:
        query = query.filter(Investment.current_value >= min_value)
    if max_value is not None:
        query = query.filter(Investment.current_value <= max_value)
    if search:
        query = query.filter(or_(Investment.name.ilike(f"%{search}%"), Investment.ticker.ilike(f"%{search}%")))
    
    investments = query.order_by(Investment.purchase_date.desc()).all()
    return [InvestmentResponse.model_validate(inv) for inv in investments]


@router.get("/stats", response_model=InvestmentStats)
async def get_investment_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Obter estatísticas de investimentos."""
    investments = db.query(Investment).filter(Investment.user_id == current_user.id).all()
    
    if not investments:
        return InvestmentStats(
            total_invested=0.0,
            current_total=0.0,
            total_profit=0.0,
            profit_percentage=0.0,
            count=0,
            by_type={},
        )
    
    total_invested = sum(inv.value for inv in investments)
    current_total = sum(inv.current_value for inv in investments)
    total_profit = current_total - total_invested
    profit_percentage = (total_profit / total_invested * 100) if total_invested > 0 else 0.0
    
    by_type = {}
    for inv in investments:
        type_name = inv.type.value
        if type_name not in by_type:
            by_type[type_name] = InvestmentTypeStats(invested=0, current=0, count=0)
        by_type[type_name].invested += inv.value
        by_type[type_name].current += inv.current_value
        by_type[type_name].count += 1
    
    return InvestmentStats(
        total_invested=total_invested,
        current_total=current_total,
        total_profit=total_profit,
        profit_percentage=profit_percentage,
        count=len(investments),
        by_type=by_type,
    )


@router.get("/{investment_id}", response_model=InvestmentResponse)
async def get_investment(
    investment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Buscar investimento por ID."""
    investment = db.query(Investment).filter(
        and_(Investment.id == investment_id, Investment.user_id == current_user.id)
    ).first()
    
    if not investment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investimento não encontrado")
    
    return InvestmentResponse.model_validate(investment)


@router.post("", response_model=InvestmentResponse, status_code=status.HTTP_201_CREATED)
async def create_investment(
    investment_data: InvestmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Criar investimento."""
    db_investment = Investment(user_id=current_user.id, **investment_data.model_dump())
    db.add(db_investment)
    db.commit()
    db.refresh(db_investment)
    
    # Criar histórico inicial
    history = InvestmentHistory(investment_id=db_investment.id, value=db_investment.current_value)
    db.add(history)
    db.commit()
    
    return InvestmentResponse.model_validate(db_investment)


@router.put("/{investment_id}", response_model=InvestmentResponse)
async def update_investment(
    investment_id: str,
    investment_data: InvestmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar investimento."""
    investment = db.query(Investment).filter(
        and_(Investment.id == investment_id, Investment.user_id == current_user.id)
    ).first()
    
    if not investment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investimento não encontrado")
    
    update_data = investment_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(investment, field, value)
    
    db.commit()
    db.refresh(investment)
    return InvestmentResponse.model_validate(investment)


@router.delete("/{investment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_investment(
    investment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deletar investimento."""
    investment = db.query(Investment).filter(
        and_(Investment.id == investment_id, Investment.user_id == current_user.id)
    ).first()
    
    if not investment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investimento não encontrado")
    
    db.delete(investment)
    db.commit()
    return None


@router.get("/{investment_id}/history", response_model=List[InvestmentHistoryResponse])
async def get_investment_history(
    investment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Buscar histórico de investimento."""
    investment = db.query(Investment).filter(
        and_(Investment.id == investment_id, Investment.user_id == current_user.id)
    ).first()
    
    if not investment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investimento não encontrado")
    
    history = db.query(InvestmentHistory).filter(
        InvestmentHistory.investment_id == investment_id
    ).order_by(InvestmentHistory.date.desc()).all()
    
    return [InvestmentHistoryResponse.model_validate(h) for h in history]


@router.patch("/{investment_id}/update-value", response_model=InvestmentResponse)
async def update_current_value(
    investment_id: str,
    request: UpdateCurrentValueRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar valor atual do investimento."""
    investment = db.query(Investment).filter(
        and_(Investment.id == investment_id, Investment.user_id == current_user.id)
    ).first()
    
    if not investment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investimento não encontrado")
    
    investment.current_value = request.current_value
    
    # Adicionar ao histórico
    history = InvestmentHistory(investment_id=investment_id, value=request.current_value)
    db.add(history)
    
    db.commit()
    db.refresh(investment)
    
    return InvestmentResponse.model_validate(investment)

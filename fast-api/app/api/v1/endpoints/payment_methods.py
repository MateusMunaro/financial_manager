from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.payment_method import PaymentMethod
from app.schemas.payment_method import (
    PaymentMethodCreate,
    PaymentMethodUpdate,
    PaymentMethodResponse,
)

router = APIRouter(prefix="/payment-methods", tags=["Payment Methods"])


@router.get("", response_model=List[PaymentMethodResponse])
async def get_payment_methods(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Listar todos os métodos de pagamento do usuário."""
    methods = db.query(PaymentMethod).filter(
        PaymentMethod.user_id == current_user.id
    ).order_by(PaymentMethod.is_default.desc(), PaymentMethod.name).all()
    
    return [PaymentMethodResponse.model_validate(method) for method in methods]


@router.get("/{method_id}", response_model=PaymentMethodResponse)
async def get_payment_method(
    method_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Buscar método de pagamento por ID."""
    method = db.query(PaymentMethod).filter(
        and_(PaymentMethod.id == method_id, PaymentMethod.user_id == current_user.id)
    ).first()
    
    if not method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Método de pagamento não encontrado",
        )
    
    return PaymentMethodResponse.model_validate(method)


@router.post("", response_model=PaymentMethodResponse, status_code=status.HTTP_201_CREATED)
async def create_payment_method(
    method_data: PaymentMethodCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Criar novo método de pagamento."""
    # Se for definido como padrão, remover o padrão dos outros
    if method_data.is_default:
        db.query(PaymentMethod).filter(
            PaymentMethod.user_id == current_user.id
        ).update({PaymentMethod.is_default: False})
    
    db_method = PaymentMethod(
        user_id=current_user.id,
        **method_data.model_dump(),
    )
    
    db.add(db_method)
    db.commit()
    db.refresh(db_method)
    
    return PaymentMethodResponse.model_validate(db_method)


@router.put("/{method_id}", response_model=PaymentMethodResponse)
async def update_payment_method(
    method_id: str,
    method_data: PaymentMethodUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Atualizar método de pagamento."""
    method = db.query(PaymentMethod).filter(
        and_(PaymentMethod.id == method_id, PaymentMethod.user_id == current_user.id)
    ).first()
    
    if not method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Método de pagamento não encontrado",
        )
    
    # Se for definido como padrão, remover o padrão dos outros
    if method_data.is_default:
        db.query(PaymentMethod).filter(
            and_(PaymentMethod.user_id == current_user.id, PaymentMethod.id != method_id)
        ).update({PaymentMethod.is_default: False})
    
    # Atualizar campos
    update_data = method_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(method, field, value)
    
    db.commit()
    db.refresh(method)
    
    return PaymentMethodResponse.model_validate(method)


@router.delete("/{method_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payment_method(
    method_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Deletar método de pagamento."""
    method = db.query(PaymentMethod).filter(
        and_(PaymentMethod.id == method_id, PaymentMethod.user_id == current_user.id)
    ).first()
    
    if not method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Método de pagamento não encontrado",
        )
    
    db.delete(method)
    db.commit()
    
    return None


@router.patch("/{method_id}/set-default", response_model=PaymentMethodResponse)
async def set_default_payment_method(
    method_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Definir método de pagamento como padrão."""
    method = db.query(PaymentMethod).filter(
        and_(PaymentMethod.id == method_id, PaymentMethod.user_id == current_user.id)
    ).first()
    
    if not method:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Método de pagamento não encontrado",
        )
    
    # Remover padrão dos outros
    db.query(PaymentMethod).filter(
        and_(PaymentMethod.user_id == current_user.id, PaymentMethod.id != method_id)
    ).update({PaymentMethod.is_default: False})
    
    # Definir como padrão
    method.is_default = True
    db.commit()
    db.refresh(method)
    
    return PaymentMethodResponse.model_validate(method)

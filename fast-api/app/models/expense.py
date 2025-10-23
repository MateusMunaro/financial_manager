from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.database import Base
from app.models.user import generate_uuid


class PaymentMethodType(str, enum.Enum):
    CREDIT_CARD = "credit-card"
    DEBIT_CARD = "debit-card"
    PIX = "pix"
    BANK_SLIP = "bank-slip"
    CASH = "cash"
    OTHER = "other"


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    date = Column(DateTime, nullable=False)
    description = Column(String(500), nullable=True)
    payment_method = Column(SQLEnum(PaymentMethodType), nullable=True)
    is_recurring = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento
    user = relationship("User", back_populates="expenses")

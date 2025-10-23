from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, ForeignKey, Enum as SQLEnum, Integer, DateTime
from sqlalchemy.orm import relationship
import enum
from app.database import Base
from app.models.user import generate_uuid
from app.models.expense import PaymentMethodType


class RecurringFrequency(str, enum.Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"
    WEEKLY = "weekly"


class RecurringExpense(Base):
    __tablename__ = "recurring_expenses"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    frequency = Column(SQLEnum(RecurringFrequency), nullable=False)
    day_of_month = Column(Integer, nullable=True)
    day_of_week = Column(Integer, nullable=True)
    payment_method = Column(SQLEnum(PaymentMethodType), nullable=True)
    is_active = Column(Boolean, default=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=True)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento
    user = relationship("User", back_populates="recurring_expenses")

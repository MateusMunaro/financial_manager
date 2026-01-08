import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=True)  # Nullable para login social
    avatar = Column(String, nullable=True)
    apple_id = Column(String, unique=True, nullable=True, index=True)  # ID único da Apple
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    expenses = relationship("Expense", back_populates="user", cascade="all, delete-orphan")
    payment_methods = relationship("PaymentMethod", back_populates="user", cascade="all, delete-orphan")
    recurring_expenses = relationship("RecurringExpense", back_populates="user", cascade="all, delete-orphan")
    investments = relationship("Investment", back_populates="user", cascade="all, delete-orphan")

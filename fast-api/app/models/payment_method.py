from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, ForeignKey, Enum as SQLEnum, Integer, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.user import generate_uuid
from app.models.expense import PaymentMethodType


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(50), nullable=False)
    type = Column(SQLEnum(PaymentMethodType), nullable=False)
    last_digits = Column(String(4), nullable=True)
    is_default = Column(Boolean, default=False)
    limit = Column(Float, nullable=True)
    used_limit = Column(Float, nullable=True, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamento
    user = relationship("User", back_populates="payment_methods")

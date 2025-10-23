from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum as SQLEnum, Integer
from sqlalchemy.orm import relationship
import enum
from app.database import Base
from app.models.user import generate_uuid


class InvestmentType(str, enum.Enum):
    RENDA_FIXA = "Renda Fixa"
    ACOES = "Ações"
    FII = "FII"
    ETF = "ETF"
    CRIPTOMOEDAS = "Criptomoedas"
    FUNDOS = "Fundos"
    OUTROS = "Outros"


class Investment(Base):
    __tablename__ = "investments"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(SQLEnum(InvestmentType), nullable=False)
    value = Column(Float, nullable=False)
    purchase_date = Column(DateTime, nullable=False)
    current_value = Column(Float, nullable=False)
    quantity = Column(Float, nullable=True)
    ticker = Column(String(20), nullable=True)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relacionamentos
    user = relationship("User", back_populates="investments")
    history = relationship("InvestmentHistory", back_populates="investment", cascade="all, delete-orphan")


class InvestmentHistory(Base):
    __tablename__ = "investment_history"

    id = Column(String, primary_key=True, default=generate_uuid)
    investment_id = Column(String, ForeignKey("investments.id"), nullable=False)
    value = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

    # Relacionamento
    investment = relationship("Investment", back_populates="history")

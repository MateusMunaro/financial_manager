from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class InvestmentType(str, Enum):
    RENDA_FIXA = "Renda Fixa"
    ACOES = "Ações"
    FII = "FII"
    ETF = "ETF"
    CRIPTOMOEDAS = "Criptomoedas"
    FUNDOS = "Fundos"
    OUTROS = "Outros"


# Investment Schemas
class InvestmentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: InvestmentType
    value: float = Field(..., gt=0)
    purchase_date: datetime
    current_value: float = Field(..., ge=0)
    quantity: Optional[float] = Field(None, gt=0)
    ticker: Optional[str] = Field(None, max_length=20)
    description: Optional[str] = Field(None, max_length=500)


class InvestmentCreate(InvestmentBase):
    pass


class InvestmentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    type: Optional[InvestmentType] = None
    value: Optional[float] = Field(None, gt=0)
    purchase_date: Optional[datetime] = None
    current_value: Optional[float] = Field(None, ge=0)
    quantity: Optional[float] = Field(None, gt=0)
    ticker: Optional[str] = Field(None, max_length=20)
    description: Optional[str] = Field(None, max_length=500)


class InvestmentResponse(InvestmentBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InvestmentFilters(BaseModel):
    type: Optional[InvestmentType] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    search: Optional[str] = None


class InvestmentTypeStats(BaseModel):
    invested: float
    current: float
    count: int


class InvestmentStats(BaseModel):
    total_invested: float
    current_total: float
    total_profit: float
    profit_percentage: float
    count: int
    by_type: dict[str, InvestmentTypeStats]


class InvestmentHistoryResponse(BaseModel):
    id: str
    investment_id: str
    value: float
    date: datetime

    model_config = ConfigDict(from_attributes=True)


class UpdateCurrentValueRequest(BaseModel):
    current_value: float = Field(..., ge=0)

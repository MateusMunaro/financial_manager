from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class PaymentMethodType(str, Enum):
    CREDIT_CARD = "credit-card"
    DEBIT_CARD = "debit-card"
    PIX = "pix"
    BANK_SLIP = "bank-slip"
    CASH = "cash"
    OTHER = "other"


class Period(str, Enum):
    DAY = "day"
    WEEK = "week"
    MONTH = "month"
    YEAR = "year"


# Expense Schemas
class ExpenseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    value: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    date: datetime
    description: Optional[str] = Field(None, max_length=500)
    payment_method: Optional[PaymentMethodType] = None
    is_recurring: Optional[bool] = False


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    value: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    date: Optional[datetime] = None
    description: Optional[str] = Field(None, max_length=500)
    payment_method: Optional[PaymentMethodType] = None
    is_recurring: Optional[bool] = None


class ExpenseResponse(ExpenseBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExpenseFilters(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    category: Optional[str] = None
    payment_method: Optional[PaymentMethodType] = None
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    is_recurring: Optional[bool] = None
    search: Optional[str] = None


class ExpenseStats(BaseModel):
    total: float
    count: int
    average: float
    by_category: dict[str, float]
    by_payment_method: dict[str, float]
    period: Period

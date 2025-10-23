from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum
from app.schemas.expense import PaymentMethodType


class RecurringFrequency(str, Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"
    WEEKLY = "weekly"


# Recurring Expense Schemas
class RecurringExpenseBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    value: float = Field(..., gt=0)
    category: str = Field(..., min_length=1)
    frequency: RecurringFrequency
    day_of_month: Optional[int] = Field(None, ge=1, le=31)
    day_of_week: Optional[int] = Field(None, ge=0, le=6)
    payment_method: Optional[PaymentMethodType] = None
    is_active: bool = True
    start_date: datetime
    end_date: Optional[datetime] = None
    description: Optional[str] = Field(None, max_length=500)


class RecurringExpenseCreate(RecurringExpenseBase):
    pass


class RecurringExpenseUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    value: Optional[float] = Field(None, gt=0)
    category: Optional[str] = None
    frequency: Optional[RecurringFrequency] = None
    day_of_month: Optional[int] = Field(None, ge=1, le=31)
    day_of_week: Optional[int] = Field(None, ge=0, le=6)
    payment_method: Optional[PaymentMethodType] = None
    is_active: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    description: Optional[str] = Field(None, max_length=500)


class RecurringExpenseResponse(RecurringExpenseBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class GenerateExpensesRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

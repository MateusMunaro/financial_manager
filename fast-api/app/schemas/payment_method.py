from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.expense import PaymentMethodType


# Payment Method Schemas
class PaymentMethodBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    type: PaymentMethodType
    last_digits: Optional[str] = Field(None, min_length=4, max_length=4)
    is_default: bool = False
    limit: Optional[float] = Field(None, gt=0)
    used_limit: Optional[float] = Field(None, ge=0)


class PaymentMethodCreate(PaymentMethodBase):
    pass


class PaymentMethodUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    type: Optional[PaymentMethodType] = None
    last_digits: Optional[str] = Field(None, min_length=4, max_length=4)
    is_default: Optional[bool] = None
    limit: Optional[float] = Field(None, gt=0)
    used_limit: Optional[float] = Field(None, ge=0)


class PaymentMethodResponse(PaymentMethodBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

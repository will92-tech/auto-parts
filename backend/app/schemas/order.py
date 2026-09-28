from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int = Field(ge=1)
    price: float = Field(ge=0)
    model_config = {'from_attributes': True}


class OrderResponse(BaseModel):
    id: str
    user_id: str
    total: float = Field(ge=0)
    status: str
    payment_method: Optional[str]
    payment_status: str
    tracking_number: Optional[str] = None
    discount: float = Field(default=0.0, ge=0)
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: datetime
    model_config = {'from_attributes': True}

from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class OrderItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    price: float
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[Dict[str, Any]]  # [{"product_id": "...", "quantity": 2}, ...]
    payment_method: str  # mpesa, card, cash
    shipping_address: Optional[Dict[str, Any]] = None
    coupon_code: Optional[str] = None
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    user_id: str
    total: float
    status: str
    payment_method: Optional[str]
    payment_status: str
    tracking_number: Optional[str]
    discount: float
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

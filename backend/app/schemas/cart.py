from pydantic import BaseModel
from datetime import datetime

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

from pydantic import BaseModel, Field


class CartItemCreate(BaseModel):
    product_id: str = Field(min_length=1)
    quantity: int = Field(default=1, ge=1, le=100)


class CartItemResponse(BaseModel):
    id: str
    product_id: str
    quantity: int
    created_at: object
    updated_at: object
    model_config = {'from_attributes': True}

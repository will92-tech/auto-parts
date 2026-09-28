from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class ProductCompatibilityResponse(BaseModel):
    id: str
    make: str
    model: str
    year_from: int
    year_to: int
    engine: Optional[str]
    model_config = {'from_attributes': True}


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    icon: str
    item_count: int
    color: str
    icon_color: str
    image: Optional[str]
    model_config = {'from_attributes': True}


class ProductResponse(BaseModel):
    id: str
    name: str
    brand: str
    sku: str
    slug: str
    price: float = Field(ge=0)
    original_price: Optional[float] = Field(None, ge=0)
    thumbnail: str
    images: List[str] = []
    description: Optional[str] = None
    specifications: Dict[str, str] = {}
    rating: float = Field(default=0.0, ge=0, le=5)
    review_count: int = Field(default=0, ge=0)
    stock_count: int = Field(default=0, ge=0)
    in_stock: bool
    condition: str = 'new'
    badge: Optional[str] = None
    tags: List[str] = []
    compatibilities: List[ProductCompatibilityResponse] = []
    created_at: datetime
    updated_at: datetime
    model_config = {'from_attributes': True}

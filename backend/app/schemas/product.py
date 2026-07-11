from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class ProductCompatibilityCreate(BaseModel):
    make: str
    model: str
    year_from: int
    year_to: int
    engine: Optional[str] = None

class ProductCompatibilityResponse(BaseModel):
    id: str
    make: str
    model: str
    year_from: int
    year_to: int
    engine: Optional[str]
    
    class Config:
        from_attributes = True

class CategoryCreate(BaseModel):
    id: str
    name: str
    slug: str
    icon: str
    item_count: int = 0
    color: str
    icon_color: str
    image: Optional[str] = None

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    icon: str
    item_count: int
    color: str
    icon_color: str
    image: Optional[str]
    
    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    id: str
    name: str
    brand: str
    sku: str
    slug: str
    price: float
    original_price: Optional[float] = None
    thumbnail: str
    images: List[str] = []
    description: Optional[str] = None
    specifications: Dict[str, str] = {}
    rating: float = 0.0
    review_count: int = 0
    stock_count: int = 0
    in_stock: bool = True
    condition: str = "new"
    badge: Optional[str] = None
    tags: List[str] = []
    compatibilities: Optional[List[ProductCompatibilityCreate]] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    stock_count: Optional[int] = None
    in_stock: Optional[bool] = None
    description: Optional[str] = None
    specifications: Optional[Dict[str, str]] = None
    badge: Optional[str] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    brand: str
    sku: str
    slug: str
    price: float
    original_price: Optional[float]
    thumbnail: str
    images: List[str]
    description: Optional[str]
    specifications: Dict[str, str]
    rating: float
    review_count: int
    stock_count: int
    in_stock: bool
    condition: str
    badge: Optional[str]
    tags: List[str]
    compatibilities: List[ProductCompatibilityResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

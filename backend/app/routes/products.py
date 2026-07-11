from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.database import get_db
from app.models.product import Product, Category
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from typing import Optional, List

router = APIRouter()

@router.get("/", response_model=dict)
async def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock_only: bool = True,
    sort: str = "best-match",
    db: Session = Depends(get_db)
):
    """List products with filtering and sorting"""
    query = db.query(Product)
    
    # Filtering
    if category:
        query = query.filter(Product.categories.any(Category.slug == category))
    
    if brand:
        query = query.filter(Product.brand == brand)
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if in_stock_only:
        query = query.filter(Product.in_stock == True)
    
    # Sorting
    if sort == "price-asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price-desc":
        query = query.order_by(Product.price.desc())
    elif sort == "newest":
        query = query.order_by(Product.created_at.desc())
    elif sort == "best-rated":
        query = query.order_by(Product.rating.desc())
    elif sort == "most-popular":
        query = query.order_by(Product.review_count.desc())
    else:  # best-match
        query = query.order_by(Product.created_at.desc())
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    return {
        "items": [ProductResponse.from_orm(p) for p in products],
        "total": total,
        "skip": skip,
        "limit": limit,
    }

@router.get("/search", response_model=list[ProductResponse])
async def search_products(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Search products by name, brand, or SKU"""
    search_term = f"%{q}%"
    products = db.query(Product).filter(
        or_(
            Product.name.ilike(search_term),
            Product.brand.ilike(search_term),
            Product.sku.ilike(search_term),
            Product.slug.ilike(search_term),
        )
    ).limit(limit).all()
    
    return [ProductResponse.from_orm(p) for p in products]

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return ProductResponse.from_orm(product)

@router.get("/slug/{slug}", response_model=ProductResponse)
async def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get product by slug"""
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return ProductResponse.from_orm(product)

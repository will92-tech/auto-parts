from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload
from typing import Optional
from app.database import get_db
from app.models.product import Product, Category
from app.schemas.product import ProductResponse

router = APIRouter()


def serialize(product):
    return ProductResponse.model_validate(product)


@router.get('/search', response_model=list[ProductResponse])
async def search_products(q: str = Query(..., min_length=1, max_length=100), limit: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    term = f'%{q.strip()}%'
    products = db.query(Product).options(selectinload(Product.compatibilities)).filter(
        or_(Product.name.ilike(term), Product.brand.ilike(term), Product.sku.ilike(term), Product.slug.ilike(term))
    ).order_by(Product.review_count.desc()).limit(limit).all()
    return [serialize(product) for product in products]


@router.get('/', response_model=dict)
async def list_products(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), category: Optional[str] = None, brand: Optional[str] = None, min_price: Optional[float] = Query(None, ge=0), max_price: Optional[float] = Query(None, ge=0), in_stock_only: bool = True, sort: str = Query('best-match', pattern='^(best-match|price-asc|price-desc|newest|best-rated|most-popular)$'), db: Session = Depends(get_db)):
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=422, detail='min_price cannot exceed max_price')
    query = db.query(Product).options(selectinload(Product.compatibilities))
    if category:
        query = query.filter(Product.categories.any(Category.slug == category))
    if brand:
        query = query.filter(Product.brand == brand)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if in_stock_only:
        query = query.filter(Product.in_stock.is_(True))
    ordering = {'price-asc': Product.price.asc(), 'price-desc': Product.price.desc(), 'newest': Product.created_at.desc(), 'best-rated': Product.rating.desc(), 'most-popular': Product.review_count.desc()}
    query = query.order_by(ordering.get(sort, Product.created_at.desc()))
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    return {'items': [serialize(product) for product in products], 'total': total, 'skip': skip, 'limit': limit}


@router.get('/slug/{slug}', response_model=ProductResponse)
async def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(selectinload(Product.compatibilities)).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')
    return serialize(product)


@router.get('/{product_id}', response_model=ProductResponse)
async def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).options(selectinload(Product.compatibilities)).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')
    return serialize(product)

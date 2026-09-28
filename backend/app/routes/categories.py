from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.product import Category
from app.schemas.product import CategoryResponse

router = APIRouter()


@router.get('/slug/{slug}', response_model=CategoryResponse)
async def get_category_by_slug(slug: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.slug == slug).first()
    if not category:
        raise HTTPException(status_code=404, detail='Category not found')
    return CategoryResponse.model_validate(category)


@router.get('/', response_model=list[CategoryResponse])
async def list_categories(db: Session = Depends(get_db)):
    return [CategoryResponse.model_validate(category) for category in db.query(Category).order_by(Category.name).all()]


@router.get('/{category_id}', response_model=CategoryResponse)
async def get_category(category_id: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail='Category not found')
    return CategoryResponse.model_validate(category)

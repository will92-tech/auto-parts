from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
import uuid
from app.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemResponse
from app.utils.security import get_current_user

router = APIRouter()


@router.get('/', response_model=dict)
async def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(CartItem).options(joinedload(CartItem.product)).filter(CartItem.user_id == current_user.id).all()
    result, total = [], 0.0
    for item in items:
        product = item.product
        if product:
            result.append({'id': item.id, 'product': {'id': product.id, 'name': product.name, 'brand': product.brand, 'price': product.price, 'thumbnail': product.thumbnail}, 'quantity': item.quantity})
            total += product.price * item.quantity
    return {'items': result, 'total': total, 'itemCount': len(result)}


@router.post('/items', response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_cart(item: CartItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail='Product not found')
    existing = db.query(CartItem).filter(CartItem.user_id == current_user.id, CartItem.product_id == item.product_id).first()
    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        return CartItemResponse.model_validate(existing)
    new_item = CartItem(id=str(uuid.uuid4()), user_id=current_user.id, product_id=item.product_id, quantity=item.quantity)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return CartItemResponse.model_validate(new_item)


@router.patch('/items/{item_id}', response_model=CartItemResponse)
async def update_cart_item(item_id: str, quantity: int = Query(..., ge=1, le=100), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail='Cart item not found')
    item.quantity = quantity
    db.commit()
    db.refresh(item)
    return CartItemResponse.model_validate(item)


@router.delete('/items/{item_id}', status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_cart(item_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail='Cart item not found')
    db.delete(item)
    db.commit()


@router.delete('/', status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()

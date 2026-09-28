from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, selectinload
import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderResponse
from app.utils.security import get_current_user, require_admin

router = APIRouter()


class OrderItemInput(BaseModel):
    product_id: str = Field(min_length=1)
    quantity: int = Field(ge=1, le=100)


class OrderCreate(BaseModel):
    items: List[OrderItemInput]
    payment_method: str = Field(pattern='^(mpesa|card|cash)$')
    shipping_address: Optional[Dict[str, Any]] = None
    coupon_code: Optional[str] = None
    notes: Optional[str] = None


@router.post('/', response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(order_create: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not order_create.items:
        raise HTTPException(status_code=400, detail='Order must contain at least one item')
    total, order_items = 0.0, []
    for item in order_create.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=400, detail=f'Product {item.product_id} not found')
        if not product.in_stock:
            raise HTTPException(status_code=400, detail=f'Product {product.name} is out of stock')
        if product.stock_count < item.quantity:
            raise HTTPException(status_code=400, detail=f'Insufficient stock for {product.name}')
        total += product.price * item.quantity
        order_items.append({'product': product, 'quantity': item.quantity})
    discount = 0.0
    total = max(0, total - discount)
    order = Order(id=str(uuid.uuid4()), user_id=current_user.id, total=total, status='pending', payment_method=order_create.payment_method, payment_status='pending', shipping_address=order_create.shipping_address, coupon_code=order_create.coupon_code, discount=discount, notes=order_create.notes)
    db.add(order)
    db.flush()
    for item_data in order_items:
        order_item = OrderItem(id=str(uuid.uuid4()), order_id=order.id, product_id=item_data['product'].id, quantity=item_data['quantity'], price=item_data['product'].price)
        db.add(order_item)
        item_data['product'].stock_count -= item_data['quantity']
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return OrderResponse.model_validate(order)


@router.get('/', response_model=list[OrderResponse])
async def list_user_orders(current_user: User = Depends(get_current_user), skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), status_filter: Optional[str] = Query(None, pattern='^(pending|processing|in-transit|delivered|cancelled)$'), db: Session = Depends(get_db)):
    query = db.query(Order).options(selectinload(Order.items)).filter(Order.user_id == current_user.id)
    if status_filter:
        query = query.filter(Order.status == status_filter)
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return [OrderResponse.model_validate(o) for o in orders]


@router.get('/{order_id}', response_model=OrderResponse)
async def get_order(order_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    order = db.query(Order).options(selectinload(Order.items)).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail='Order not found')
    return OrderResponse.model_validate(order)


@router.patch('/{order_id}/status', response_model=OrderResponse)
async def update_order_status(order_id: str, new_status: str = Query(..., pattern='^(pending|processing|in-transit|delivered|cancelled)$'), admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail='Order not found')
    order.status = new_status
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    return OrderResponse.model_validate(order)

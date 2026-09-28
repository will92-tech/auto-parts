from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from datetime import datetime
from app.database import Base


class CartItem(Base):
    __tablename__ = 'cart_item'
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey('user.id'), nullable=False, index=True)
    product_id = Column(String, ForeignKey('product.id'), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

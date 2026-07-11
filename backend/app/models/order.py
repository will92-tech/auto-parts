from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Order(Base):
    __tablename__ = "order"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"), nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, processing, in-transit, delivered, cancelled
    payment_method = Column(String, nullable=True)  # mpesa, card, cash
    payment_status = Column(String, default="pending")  # pending, completed, failed
    tracking_number = Column(String, nullable=True, index=True)
    shipping_address = Column(JSON, nullable=True)
    coupon_code = Column(String, nullable=True)
    discount = Column(Float, default=0.0)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_item"
    
    id = Column(String, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("order.id"), nullable=False)
    product_id = Column(String, ForeignKey("product.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # Price at time of purchase
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order = relationship("Order", back_populates="items")

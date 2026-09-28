from sqlalchemy import Column, String, Float, Integer, Boolean, Text, DateTime, ForeignKey, Table, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

product_category = Table('product_category', Base.metadata, Column('product_id', String, ForeignKey('product.id')), Column('category_id', String, ForeignKey('category.id')))


class Category(Base):
    __tablename__ = 'category'
    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    icon = Column(String)
    item_count = Column(Integer, default=0)
    color = Column(String)
    icon_color = Column(String)
    image = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    products = relationship('Product', secondary=product_category, back_populates='categories')


class Product(Base):
    __tablename__ = 'product'
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    brand = Column(String, index=True, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    thumbnail = Column(String, nullable=False)
    images = Column(JSON, default=list)
    description = Column(Text, nullable=True)
    specifications = Column(JSON, default=dict)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    stock_count = Column(Integer, default=0)
    in_stock = Column(Boolean, default=True)
    condition = Column(String, default='new')
    badge = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    categories = relationship('Category', secondary=product_category, back_populates='products')
    compatibilities = relationship('ProductCompatibility', back_populates='product', cascade='all, delete-orphan')
    reviews = relationship('ProductReview', back_populates='product', cascade='all, delete-orphan')


class ProductCompatibility(Base):
    __tablename__ = 'product_compatibility'
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey('product.id'), nullable=False)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year_from = Column(Integer, nullable=False)
    year_to = Column(Integer, nullable=False)
    engine = Column(String, nullable=True)
    product = relationship('Product', back_populates='compatibilities')


class ProductReview(Base):
    __tablename__ = 'product_review'
    id = Column(String, primary_key=True, index=True)
    product_id = Column(String, ForeignKey('product.id'), nullable=False)
    user_id = Column(String, ForeignKey('user.id'), nullable=False)
    author_name = Column(String, nullable=False)
    author_initials = Column(String, nullable=True)
    avatar_color = Column(String, default='bg-brand-blue')
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    verified = Column(Boolean, default=False)
    location = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    product = relationship('Product', back_populates='reviews')

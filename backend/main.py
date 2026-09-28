from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import Base, engine
from app import models
from app.routes import products, categories, cart, orders, users, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.API_TITLE, description=settings.API_DESCRIPTION, version=settings.API_VERSION, lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
app.include_router(auth.router, prefix='/api/auth', tags=['auth'])
app.include_router(users.router, prefix='/api/users', tags=['users'])
app.include_router(categories.router, prefix='/api/categories', tags=['categories'])
app.include_router(products.router, prefix='/api/products', tags=['products'])
app.include_router(cart.router, prefix='/api/cart', tags=['cart'])
app.include_router(orders.router, prefix='/api/orders', tags=['orders'])


@app.get('/')
async def root():
    return {'message': 'AutoPartsPro API', 'version': settings.API_VERSION, 'docs': '/docs'}


@app.get('/health')
async def health_check():
    return {'status': 'healthy'}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import uuid
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.utils.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


def token_for(user):
    return TokenResponse(access_token=create_access_token({'sub': user.id}, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)), user=UserResponse.model_validate(user))


@router.post('/register', response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_create: UserCreate, db: Session = Depends(get_db)):
    email = user_create.email.strip().lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail='Email already registered')
    user = User(id=str(uuid.uuid4()), email=email, first_name=user_create.first_name.strip(), last_name=user_create.last_name.strip(), phone=user_create.phone, hashed_password=hash_password(user_create.password), avatar_initials=f'{user_create.first_name[0]}{user_create.last_name[0]}'.upper())
    db.add(user)
    db.commit()
    db.refresh(user)
    return token_for(user)


@router.post('/login', response_model=TokenResponse)
async def login(user_login: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_login.email.strip().lower()).first()
    if not user or not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Invalid email or password', headers={'WWW-Authenticate': 'Bearer'})
    return token_for(user)


@router.get('/me', response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

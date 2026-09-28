from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class SavedVehicleCreate(BaseModel):
    make: str = Field(min_length=1, max_length=80)
    model: str = Field(min_length=1, max_length=80)
    year: str = Field(pattern=r'^\d{4}$')
    engine: Optional[str] = None
    registration: Optional[str] = None
    is_default: bool = False


class SavedVehicleResponse(SavedVehicleCreate):
    id: str
    model_config = {'from_attributes': True}


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    avatar_initials: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    is_admin: bool = False
    saved_vehicles: list[SavedVehicleResponse] = []
    created_at: datetime
    model_config = {'from_attributes': True}


class UserCreate(BaseModel):
    email: EmailStr
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=8, max_length=128)
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserResponse

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class SavedVehicleCreate(BaseModel):
    make: str
    model: str
    year: str
    engine: Optional[str] = None
    registration: Optional[str] = None
    is_default: bool = False

class SavedVehicleResponse(BaseModel):
    id: str
    make: str
    model: str
    year: str
    engine: Optional[str]
    registration: Optional[str]
    is_default: bool
    
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    avatar_initials: Optional[str]
    phone: Optional[str]
    is_active: bool
    saved_vehicles: List[SavedVehicleResponse]
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

from pydantic import BaseModel, Field
from typing import Optional


class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    avatar_initials: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    is_admin: bool = False
    saved_vehicles: list = []
    created_at: object
    model_config = {'from_attributes': True}


class UserCreate(BaseModel):
    email: str
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=8, max_length=128)
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: UserResponse


class SavedVehicleCreate(BaseModel):
    make: str = Field(min_length=1, max_length=80)
    model: str = Field(min_length=1, max_length=80)
    year: str = Field(min_length=4, max_length=4)
    engine: Optional[str] = None
    registration: Optional[str] = None
    is_default: bool = False


class SavedVehicleResponse(SavedVehicleCreate):
    id: str
    model_config = {'from_attributes': True}

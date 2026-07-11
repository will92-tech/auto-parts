from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from app.database import get_db
from app.models.user import User, SavedVehicle
from app.schemas.user import UserResponse, SavedVehicleCreate, SavedVehicleResponse
from app.utils.security import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get user profile"""
    return UserResponse.from_orm(current_user)

@router.post("/saved-vehicles", response_model=SavedVehicleResponse, status_code=status.HTTP_201_CREATED)
async def add_saved_vehicle(
    vehicle: SavedVehicleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a saved vehicle for the user"""
    new_vehicle = SavedVehicle(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        **vehicle.dict()
    )
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return SavedVehicleResponse.from_orm(new_vehicle)

@router.get("/saved-vehicles", response_model=list[SavedVehicleResponse])
async def get_saved_vehicles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all saved vehicles for user"""
    vehicles = db.query(SavedVehicle).filter(SavedVehicle.user_id == current_user.id).all()
    return [SavedVehicleResponse.from_orm(v) for v in vehicles]

@router.delete("/saved-vehicles/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_saved_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a saved vehicle"""
    vehicle = db.query(SavedVehicle).filter(
        SavedVehicle.id == vehicle_id,
        SavedVehicle.user_id == current_user.id
    ).first()
    
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    db.delete(vehicle)
    db.commit()

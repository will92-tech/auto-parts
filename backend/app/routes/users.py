from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from app.database import get_db
from app.models.user import User, SavedVehicle
from app.schemas.user import SavedVehicleCreate, SavedVehicleResponse, UserResponse
from app.utils.security import get_current_user

router = APIRouter()


@router.get('/profile', response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.post('/saved-vehicles', response_model=SavedVehicleResponse, status_code=status.HTTP_201_CREATED)
async def add_saved_vehicle(vehicle: SavedVehicleCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_vehicle = SavedVehicle(id=str(uuid.uuid4()), user_id=current_user.id, **vehicle.model_dump())
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return SavedVehicleResponse.model_validate(new_vehicle)


@router.get('/saved-vehicles', response_model=list[SavedVehicleResponse])
async def get_saved_vehicles(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [SavedVehicleResponse.model_validate(v) for v in db.query(SavedVehicle).filter(SavedVehicle.user_id == current_user.id).all()]


@router.delete('/saved-vehicles/{vehicle_id}', status_code=status.HTTP_204_NO_CONTENT)
async def delete_saved_vehicle(vehicle_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    vehicle = db.query(SavedVehicle).filter(SavedVehicle.id == vehicle_id, SavedVehicle.user_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail='Vehicle not found')
    db.delete(vehicle)
    db.commit()

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.rental import Rental
from app.models.equipment import Equipment
from app.schemas.rental import RentalCreate, RentalResponse, RentalUpdate
from app.services import rental_service, stock_level_service, equipment_service

router = APIRouter()

@router.post("/rentals", response_model=RentalResponse)
def create_rental(
    rental: RentalCreate,
    db: Session = Depends(get_db),
):
    try:
        equipment_type_id = rental.equipment_id
        print(f"DEBUG: Starting rental process for type {equipment_type_id}")

        initial_count = stock_level_service.count_available_equipment(db, equipment_type_id)
        
        if initial_count <= 0:
            raise HTTPException(status_code=400, detail="No equipment available")

        available_equipment = equipment_service.get_random_available_equipment_of_type(db, equipment_type_id)
        if not available_equipment:
            raise HTTPException(status_code=400, detail="Could not allocate equipment")

        available_equipment.is_available = False
        db.flush()

        new_rental = Rental(
            user_id=rental.user_id,
            equipment_id=available_equipment.id,
            start_date=rental.start_date,
            end_date=rental.end_date,
            total_cost=rental.total_cost,
            created_at=datetime.now()
        )
        db.add(new_rental)
        
        stock_level_service.update_available_count(db, equipment_type_id)
        db.commit()
        
        db.refresh(new_rental)
        return new_rental
        
    except Exception as e:
        db.rollback()
        print(f"DEBUG: Error in rental creation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rentals/user", response_model=list[RentalResponse])
def get_user_rentals(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Rental).filter(Rental.user_id == current_user.id).all()

@router.get("/rentals/{rental_id}", response_model=RentalResponse)
def get_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    rental = rental_service.get_rental_by_id(db, rental_id)
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    if rental.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return rental

@router.get("/rentals/active", response_model=List[RentalResponse])
def get_active_rentals(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return rental_service.get_active_rentals(db, current_user.id)

@router.put("/rentals/{rental_id}", response_model=RentalResponse)
def update_rental(
    rental_id: int,
    rental_update: RentalUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    rental = rental_service.get_rental_by_id(db, rental_id)
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    if rental.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if rental_update.start_date and rental_update.end_date:
        if not rental_service.check_equipment_availability(
            db, rental.equipment_id, rental_update.start_date, rental_update.end_date
        ):
            raise HTTPException(status_code=400, detail="Equipment not available for these dates")
    
    updated_rental = rental_service.update_rental(db, rental_id, rental_update)
    return updated_rental

@router.delete("/rentals/{rental_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rental(
    rental_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    rental = rental_service.get_rental_by_id(db, rental_id)
    if not rental:
        raise HTTPException(status_code=404, detail="Rental not found")
    if rental.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    rental_service.finish_rental(db, rental_id)
    rental_service.delete_rental(db, rental_id)

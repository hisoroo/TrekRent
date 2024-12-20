from app.models.equipment import Equipment
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.equipment import EquipmentCreate, EquipmentRead
from app.schemas.equipment_type import EquipmentTypeRead
from typing import List
from app.services import equipment_service

router = APIRouter(prefix="/equipment", tags=["equipment"])

@router.post("/", response_model=EquipmentRead)
def create_equipment(
    equipment: EquipmentCreate,
    db: Session = Depends(get_db)
):
    return equipment_service.create_equipment(db, equipment)

@router.get("/", response_model=List[EquipmentRead])
def get_all_equipment(
    db: Session = Depends(get_db),
):
    return db.query(Equipment).all()

@router.get("/{equipment_id}", response_model=EquipmentRead)
def get_equipment(
    equipment_id: int,
    db: Session = Depends(get_db)
):
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment

@router.get("/{equipment_id}/type", response_model=EquipmentTypeRead)
def get_equipment_type(
    equipment_id: int,
    db: Session = Depends(get_db)
):
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment.equipment_type

@router.get("/available", response_model=List[EquipmentRead])
def get_available_equipment(db: Session = Depends(get_db)):
    return db.query(Equipment).filter(Equipment.is_available == True).all()

@router.get("/available/{equipment_type_id}", response_model=EquipmentRead)
def get_available_equipment_by_type(
    equipment_type_id: int,
    db: Session = Depends(get_db)
):
    equipment = equipment_service.find_available_equipment_of_type(db, equipment_type_id)
    if not equipment:
        raise HTTPException(status_code=404, detail="No available equipment found")
    return equipment

@router.patch("/{equipment_id}/availability", response_model=EquipmentRead)
def update_equipment_availability(
    equipment_id: int,
    is_available: bool = Query(...),
    db: Session = Depends(get_db)
):
    equipment = equipment_service.update_equipment_availability(db, equipment_id, is_available)
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment

@router.delete("/{equipment_id}", response_model=dict)
def delete_equipment(equipment_id: int, db: Session = Depends(get_db)):
    result = equipment_service.delete_equipment(db, equipment_id)
    if not result:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"status": "success", "message": "Equipment deleted"}

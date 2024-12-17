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
    new_equipment = Equipment(**equipment.dict())
    db.add(new_equipment)
    db.commit()
    db.refresh(new_equipment)
    return new_equipment

@router.get("/", response_model=List[EquipmentRead])
def get_all_equipment(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    return db.query(Equipment).offset(skip).limit(limit).all()

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

@router.post("/initialize/{equipment_type_id}")
def initialize_equipment_for_type(
    equipment_type_id: int,
    count: int = Query(default=5, ge=1, le=100),
    db: Session = Depends(get_db)
):
    try:
        equipment_list = equipment_service.create_initial_equipment_for_type(db, equipment_type_id, count)
        return {
            "message": f"Successfully created {len(equipment_list)} pieces of equipment",
            "equipment_type_id": equipment_type_id,
            "created_count": len(equipment_list)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

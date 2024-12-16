import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import equipment_type_service
from app.schemas.equipment_type import EquipmentTypeCreate, EquipmentTypeRead
from typing import List

router = APIRouter()

@router.post("/equipment-types/", response_model=EquipmentTypeRead, status_code=status.HTTP_201_CREATED)
async def create_equipment_type(type_data: EquipmentTypeCreate, db: Session = Depends(get_db)):
    try:
        return equipment_type_service.create_equipment_type(db, type_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/equipment-types/", response_model=List[EquipmentTypeRead])
def get_equipment_types(db: Session = Depends(get_db)):
    try:
        types = equipment_type_service.get_all_equipment_types(db)
        logging.info(f"Retrieved {len(types)} types from database")
        
        result = []
        for type_obj in types:
            try:
                type_dict = {
                    "id": type_obj.id,
                    "name": type_obj.name,
                    "price": float(type_obj.price),
                    "description": type_obj.description,
                    "image_path": type_obj.image_path
                }
                logging.info(f"Processing type: {type_dict}")
                result.append(type_dict)
            except Exception as e:
                logging.error(f"Error processing type: {e}", exc_info=True)
        
        logging.info(f"Final result: {result}")
        return result
    except Exception as e:
        logging.error(f"Error in get_equipment_types: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/equipment-types/{type_id}", response_model=EquipmentTypeRead)
def get_equipment_type(type_id: int, db: Session = Depends(get_db)):
    eq_type = equipment_type_service.get_equipment_type(db, type_id)
    if not eq_type:
        raise HTTPException(status_code=404, detail="Equipment type not found")
    return eq_type

@router.put("/equipment-types/{type_id}", response_model=EquipmentTypeRead)
async def update_equipment_type(type_id: int, type_data: EquipmentTypeCreate, db: Session = Depends(get_db)):
    try:
        eq_type = equipment_type_service.update_equipment_type(db, type_id, type_data)
        if eq_type is None:
            raise HTTPException(status_code=404, detail="Equipment type not found")
        return eq_type
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/equipment-types/{type_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_equipment_type(type_id: int, db: Session = Depends(get_db)):
    if not equipment_type_service.delete_equipment_type(db, type_id):
        raise HTTPException(status_code=404, detail="Equipment type not found")

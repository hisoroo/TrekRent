import logging
from sqlalchemy.orm import Session
from ..models.equipment_type import EquipmentType
from ..schemas.equipment_type import EquipmentTypeCreate
from . import stock_level_service

def get_equipment_type(db: Session, type_id: int) -> EquipmentType:
    return db.query(EquipmentType).filter(EquipmentType.id == type_id).first()

def get_all_equipment_types(db: Session) -> list[EquipmentType]:
    try:
        logging.info("Executing database query for all equipment types")
        types = db.query(EquipmentType).order_by(EquipmentType.id).all()
        logging.info(f"Retrieved {len(types)} equipment types from database")
        for type_obj in types:
            logging.info(f"Type found: ID={type_obj.id}, Name={type_obj.name}")
        return types
    except Exception as e:
        logging.error(f"Database error: {str(e)}")
        raise

def create_equipment_type(db: Session, type_data: EquipmentTypeCreate) -> EquipmentType:
    try:
        type_dict = type_data.model_dump()
        eq_type = EquipmentType(**type_dict)
        logging.info(f"Creating equipment type: {eq_type}")
        db.add(eq_type)
        db.commit()
        db.refresh(eq_type)
        stock_level_service.create_stock_level(db, {"equipment_type_id": eq_type.id, "available_count": 0})
        return eq_type
    except Exception as e:
        db.rollback()
        logging.error(f"Error creating equipment type: {str(e)}")
        raise ValueError(f"Could not create equipment type: {str(e)}")

def update_equipment_type(db: Session, type_id: int, type_data: EquipmentTypeCreate) -> EquipmentType:
    try:
        eq_type = get_equipment_type(db, type_id)
        if eq_type:
            update_data = type_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(eq_type, key, value)
            db.commit()
            db.refresh(eq_type)
        return eq_type
    except Exception as e:
        db.rollback()
        logging.error(f"Error updating equipment type: {str(e)}")
        raise ValueError(f"Could not update equipment type: {str(e)}")

def delete_equipment_type(db: Session, type_id: int) -> bool:
    eq_type = get_equipment_type(db, type_id)
    if (eq_type):
        db.delete(eq_type)
        db.commit()
        return True
    return False

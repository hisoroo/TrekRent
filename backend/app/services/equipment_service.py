from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from ..models.equipment import Equipment
from ..schemas.equipment import EquipmentCreate, EquipmentRead
from . import stock_level_service

def get_equipment_by_id(db: Session, equipment_id: int) -> Equipment:
    return db.query(Equipment).filter(Equipment.id == equipment_id).first()

def get_all_equipment(db: Session) -> list[Equipment]:
    return db.query(Equipment).all()

def create_equipment(db: Session, eq_data: EquipmentCreate) -> Equipment:
    eq = Equipment(**eq_data.dict())
    db.add(eq)
    db.commit()
    db.refresh(eq)
    stock_level_service.recalculate_stock_level(db, eq.equipment_type_id)
    return eq

def update_equipment(db: Session, equipment_id: int, eq_data: EquipmentCreate) -> Equipment:
    eq = get_equipment_by_id(db, equipment_id)
    if eq:
        old_type_id = eq.equipment_type_id
        eq.equipment_type_id = eq_data.equipment_type_id
        eq.is_available = eq_data.is_available
        db.commit()
        db.refresh(eq)
        stock_level_service.recalculate_stock_level(db, old_type_id)
        if old_type_id != eq.equipment_type_id:
            stock_level_service.recalculate_stock_level(db, eq.equipment_type_id)
    return eq

def delete_equipment(db: Session, equipment_id: int) -> bool:
    eq = get_equipment_by_id(db, equipment_id)
    if eq:
        type_id = eq.equipment_type_id
        db.delete(eq)
        db.commit()
        stock_level_service.recalculate_stock_level(db, type_id)
        return True
    return False

def find_available_equipment_of_type(db: Session, equipment_type_id: int) -> Equipment:
    return db.query(Equipment)\
        .filter(
            Equipment.equipment_type_id == equipment_type_id,
            Equipment.is_available == True
        ).first()

def get_random_available_equipment_of_type(db: Session, equipment_type_id: int) -> Equipment:
    return db.query(Equipment)\
        .filter(
            Equipment.equipment_type_id == equipment_type_id,
            Equipment.is_available == True
        )\
        .order_by(func.random())\
        .with_for_update(skip_locked=True)\
        .first()

def mark_equipment_as_unavailable(db: Session, equipment_id: int) -> bool:
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if equipment and equipment.is_available:
        equipment.is_available = False
        db.commit()
        return True
    return False

def create_initial_equipment_for_type(db: Session, equipment_type_id: int, count: int = 5) -> list[Equipment]:
    equipment_list = []
    for _ in range(count):
        eq = Equipment(
            equipment_type_id=equipment_type_id,
            is_available=True
        )
        db.add(eq)
        equipment_list.append(eq)
    
    db.commit()
    for eq in equipment_list:
        db.refresh(eq)
    
    stock_level_service.recalculate_stock_level(db, equipment_type_id)
    
    return equipment_list

def update_equipment_availability(db: Session, equipment_id: int, is_available: bool) -> Equipment:
    equipment = get_equipment_by_id(db, equipment_id)
    if equipment:
        old_availability = equipment.is_available
        equipment.is_available = is_available
        db.commit()
        db.refresh(equipment)
        
        # Aktualizacja stock_level tylko jeśli zmienił się stan dostępności
        if old_availability != is_available:
            stock_level_service.recalculate_stock_level(db, equipment.equipment_type_id)
            
    return equipment

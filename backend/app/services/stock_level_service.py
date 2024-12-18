from sqlalchemy.orm import Session
from ..models.stock_level import StockLevel
from ..schemas.stock_level import StockLevelCreate
from ..models.equipment import Equipment
from sqlalchemy import func

def get_stock_level_by_equipment_type(db: Session, eq_type_id: int) -> StockLevel:
    return db.query(StockLevel).filter(StockLevel.equipment_type_id == eq_type_id).first()

def create_stock_level(db: Session, sl_data: StockLevelCreate) -> StockLevel:
    sl = StockLevel(**sl_data.dict())
    db.add(sl)
    db.commit()
    db.refresh(sl)
    return sl

def update_stock_level(db: Session, eq_type_id: int, count: int) -> StockLevel:
    sl = get_stock_level_by_equipment_type(db, eq_type_id)
    if not sl:
        sl = create_stock_level(db, StockLevelCreate(equipment_type_id=eq_type_id, available_count=count))
    else:
        sl.available_count = count
        db.commit()
        db.refresh(sl)
    return sl

def recalculate_stock_level(db: Session, eq_type_id: int) -> StockLevel:
    available_count = db.query(Equipment).filter(
        Equipment.equipment_type_id == eq_type_id,
        Equipment.is_available == True
    ).count()
    return update_stock_level(db, eq_type_id, available_count)

def delete_stock_level(db: Session, eq_type_id: int) -> bool:
    sl = get_stock_level_by_equipment_type(db, eq_type_id)
    if sl:
        db.delete(sl)
        db.commit()
        return True
    return False

def get_all_stock_levels(db: Session, skip: int = 0, limit: int = None) -> list[StockLevel]:
    query = db.query(StockLevel)
    if skip:
        query = query.offset(skip)
    if limit:
        query = query.limit(limit)
    return query.all()

def get_available_stock_levels(db: Session, skip: int = 0, limit: int = 20) -> list[StockLevel]:
    return db.query(StockLevel)\
        .filter(StockLevel.available_count > 0)\
        .offset(skip)\
        .limit(limit)\
        .all()

def count_available_equipment(db: Session, equipment_type_id: int) -> int:
    return db.query(Equipment)\
        .filter(
            Equipment.equipment_type_id == equipment_type_id,
            Equipment.is_available == True
        ).count()

def update_available_count(db: Session, equipment_type_id: int) -> None:
    available_count = count_available_equipment(db, equipment_type_id)
    stock_level = get_stock_level_by_equipment_type(db, equipment_type_id)
    if stock_level and stock_level.available_count != available_count:
        stock_level.available_count = available_count
        db.commit()

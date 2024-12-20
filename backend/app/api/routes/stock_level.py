from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.services import stock_level_service
from app.schemas.stock_level import StockLevelRead

router = APIRouter(prefix="/stock-levels", tags=["stock-levels"])

@router.get("/", response_model=List[StockLevelRead])
def get_all_stock_levels(
    skip: int = Query(0, ge=0, description="Liczba rekordów do pominięcia"),
    limit: int = Query(None, description="Maksymalna liczba zwracanych rekordów"),
    only_available: bool = Query(False, description="Pokaż tylko dostępne sprzęty"),
    db: Session = Depends(get_db)
):
    if only_available:
        return stock_level_service.get_available_stock_levels(db, skip, limit)
    return stock_level_service.get_all_stock_levels(db, skip, limit)

@router.get("/{equipment_type_id}", response_model=StockLevelRead)
def get_stock_level(equipment_type_id: int, db: Session = Depends(get_db)):
    stock_level = stock_level_service.get_stock_level_by_equipment_type(db, equipment_type_id)
    if not stock_level:
        raise HTTPException(
            status_code=404,
            detail=f"Stock level for equipment type {equipment_type_id} not found"
        )
    return stock_level

@router.post("/{equipment_type_id}/recalculate", response_model=StockLevelRead)
def recalculate_stock_level(equipment_type_id: int, db: Session = Depends(get_db)):
    return stock_level_service.recalculate_stock_level(db, equipment_type_id)

@router.get("/available/{equipment_type_id}")
def check_availability(equipment_type_id: int, db: Session = Depends(get_db)):
    stock_level = stock_level_service.get_stock_level_by_equipment_type(db, equipment_type_id)
    if not stock_level:
        raise HTTPException(
            status_code=404,
            detail=f"Stock level for equipment type {equipment_type_id} not found"
        )
    return {"available": stock_level.available_count > 0, "count": stock_level.available_count}

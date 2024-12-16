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
    limit: int = Query(20, ge=1, le=100, description="Maksymalna liczba zwracanych rekordów"),
    only_available: bool = Query(False, description="Pokaż tylko dostępne sprzęty"),
    db: Session = Depends(get_db)
):
    """
    Pobierz listę stanów magazynowych z możliwością filtrowania i paginacji.
    - **skip**: Pomija określoną liczbę rekordów
    - **limit**: Maksymalna liczba zwracanych rekordów
    - **only_available**: Jeśli True, zwraca tylko typy sprzętu z dostępnymi sztukami
    """
    if only_available:
        return stock_level_service.get_available_stock_levels(db, skip, limit)
    return stock_level_service.get_all_stock_levels(db, skip, limit)

@router.get("/{equipment_type_id}", response_model=StockLevelRead)
def get_stock_level(equipment_type_id: int, db: Session = Depends(get_db)):
    """Pobierz stan magazynowy dla konkretnego typu sprzętu"""
    stock_level = stock_level_service.get_stock_level_by_equipment_type(db, equipment_type_id)
    if not stock_level:
        raise HTTPException(
            status_code=404,
            detail=f"Stock level for equipment type {equipment_type_id} not found"
        )
    return stock_level

@router.post("/{equipment_type_id}/recalculate", response_model=StockLevelRead)
def recalculate_stock_level(equipment_type_id: int, db: Session = Depends(get_db)):
    """Przelicz ponownie stan magazynowy dla danego typu sprzętu"""
    return stock_level_service.recalculate_stock_level(db, equipment_type_id)

@router.get("/available/{equipment_type_id}")
def check_availability(equipment_type_id: int, db: Session = Depends(get_db)):
    """Sprawdź czy dany typ sprzętu jest dostępny"""
    stock_level = stock_level_service.get_stock_level_by_equipment_type(db, equipment_type_id)
    if not stock_level:
        raise HTTPException(
            status_code=404,
            detail=f"Stock level for equipment type {equipment_type_id} not found"
        )
    return {"available": stock_level.available_count > 0, "count": stock_level.available_count}

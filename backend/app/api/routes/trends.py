from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.trends_service import get_rentals_timeline, get_equipment_trends
from app.schemas.trends import RentalsTrends, EquipmentTrends

router = APIRouter()

@router.get("/rentals", response_model=RentalsTrends)
async def read_rentals_trends(
    days: int = 7,
    db: Session = Depends(get_db)
):
    timeline = get_rentals_timeline(db, days)
    return {"timeline": timeline}

@router.get("/equipment", response_model=EquipmentTrends)
async def read_equipment_trends(
    days: int = None,
    db: Session = Depends(get_db)
):
    return get_equipment_trends(db, days)

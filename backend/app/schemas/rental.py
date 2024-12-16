from pydantic import BaseModel
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

class RentalBase(BaseModel):
    equipment_id: int
    user_id: int
    start_date: date
    end_date: date
    total_cost: Decimal
    created_at: datetime = None

class RentalCreate(BaseModel):
    equipment_id: int
    user_id: int
    start_date: date
    end_date: date
    total_cost: float

    class Config:
        schema_extra = {
            "example": {
                "equipment_id": 1,
                "user_id": 1,
                "start_date": "2024-01-01",
                "end_date": "2024-01-05",
                "total_cost": 100.00
            }
        }

class RentalUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class RentalResponse(RentalBase):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True

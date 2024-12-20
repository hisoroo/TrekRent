from pydantic import BaseModel
from typing import List
from datetime import date

class TimelinePoint(BaseModel):
    date: date
    rentals: int

class EquipmentShare(BaseModel):
    name: str
    value: float

class StockLevel(BaseModel):
    name: str
    available: int
    total: int

class RentalsTrends(BaseModel):
    timeline: List[TimelinePoint]

class EquipmentTrends(BaseModel):
    stock_levels: List[StockLevel]
    share: List[EquipmentShare]

from pydantic import BaseModel

class StockLevelBase(BaseModel):
    equipment_type_id: int
    available_count: int = 0

class StockLevelCreate(StockLevelBase):
    pass

class EquipmentTypeInfo(BaseModel):
    id: int
    name: str
    price: float

    class Config:
        orm_mode = True

class StockLevelRead(StockLevelBase):
    id: int
    equipment_type: EquipmentTypeInfo

    class Config:
        orm_mode = True

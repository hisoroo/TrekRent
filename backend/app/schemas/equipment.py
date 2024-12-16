from pydantic import BaseModel

class EquipmentBase(BaseModel):
    equipment_type_id: int
    is_available: bool = True

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentRead(EquipmentBase):
    id: int

    class Config:
        orm_mode = True

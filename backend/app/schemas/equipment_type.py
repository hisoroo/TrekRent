from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from typing import Optional

class EquipmentTypeBase(BaseModel):
    name: str
    price: Decimal
    description: Optional[str] = None
    image_path: Optional[str] = None
    
    model_config = ConfigDict(
        from_attributes=True,
        json_encoders={
            Decimal: str 
        }
    )

class EquipmentTypeCreate(EquipmentTypeBase):
    pass

class EquipmentTypeRead(EquipmentTypeBase):
    id: int

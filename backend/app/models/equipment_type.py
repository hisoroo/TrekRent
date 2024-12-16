from sqlalchemy import Column, BigInteger, String, Numeric, Text
from sqlalchemy.orm import relationship
from ..db.base import Base

class EquipmentType(Base):
    __tablename__ = "equipment_types"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    description = Column(Text, nullable=True)
    image_path = Column(String(255), nullable=True)
    
    equipment_items = relationship("Equipment", back_populates="equipment_type", cascade="all, delete")
    stock_level = relationship("StockLevel", back_populates="equipment_type", uselist=False, cascade="all, delete")

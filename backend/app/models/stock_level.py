from sqlalchemy import Column, BigInteger, Integer, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import Base

class StockLevel(Base):
    __tablename__ = "stock_levels"
    
    id = Column(BigInteger, primary_key=True, index=True)
    equipment_type_id = Column(BigInteger, ForeignKey("equipment_types.id", ondelete="CASCADE"), nullable=False, unique=True)
    available_count = Column(Integer, default=0)
    
    equipment_type = relationship("EquipmentType", back_populates="stock_level")

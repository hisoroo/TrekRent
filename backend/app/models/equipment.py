from sqlalchemy import Column, BigInteger, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from ..db.base import Base

class Equipment(Base):
    __tablename__ = "equipment"
    
    id = Column(BigInteger, primary_key=True, index=True)
    equipment_type_id = Column(BigInteger, ForeignKey("equipment_types.id", ondelete="CASCADE"), nullable=False)
    is_available = Column(Boolean, default=True)
    
    equipment_type = relationship("EquipmentType", back_populates="equipment_items")
    rentals = relationship("Rental", back_populates="equipment", cascade="all, delete-orphan")
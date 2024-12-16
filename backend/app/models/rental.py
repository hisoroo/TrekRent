from sqlalchemy import Column, BigInteger, Date, ForeignKey, Numeric, DateTime, func
from sqlalchemy.orm import relationship
from ..db.base import Base

class Rental(Base):
    __tablename__ = "rentals"
    
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    equipment_id = Column(BigInteger, ForeignKey("equipment.id", ondelete="CASCADE"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_cost = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    user = relationship("User", back_populates="rentals")
    equipment = relationship("Equipment", back_populates="rentals")

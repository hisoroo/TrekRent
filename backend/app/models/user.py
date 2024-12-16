from sqlalchemy import Column, BigInteger, String, Boolean
from sqlalchemy.orm import relationship
from ..db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(BigInteger, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    firstname = Column(String(100))
    lastname = Column(String(100))
    phonenumber = Column(String(20))
    street = Column(String(255))
    house_number = Column(String(10))
    apartment_number = Column(String(10))
    postal_code = Column(String(10))
    city = Column(String(100))
    country = Column(String(100))
    user_group = Column(String(50), default="user")

    rentals = relationship("Rental", back_populates="user", cascade="all, delete-orphan")
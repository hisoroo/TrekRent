from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import and_
from ..models.rental import Rental
from ..models.equipment import Equipment
from ..schemas.rental import RentalCreate, RentalUpdate
from . import stock_level_service

def get_rental_by_id(db: Session, rental_id: int) -> Rental:
    return db.query(Rental).filter(Rental.id == rental_id).first()

def get_rentals_by_user(db: Session, user_id: int) -> list[Rental]:
    return db.query(Rental).filter(Rental.user_id == user_id).all()

def get_all_rentals(db: Session) -> list[Rental]:
    return db.query(Rental).all()

def create_rental(db: Session, rental_data: RentalCreate) -> Rental:
    rental = Rental(
        start_date=rental_data.start_date,
        end_date=rental_data.end_date,
        equipment_id=rental_data.equipment_id,
        user_id=rental_data.user_id,
        total_cost=rental_data.total_cost
    )
    db.add(rental)
    db.commit()
    db.refresh(rental)
    return rental

def update_rental(db: Session, rental_id: int, rental_data: RentalUpdate) -> Rental:
    rental = get_rental_by_id(db, rental_id)
    if rental:
        if rental_data.start_date is not None:
            rental.start_date = rental_data.start_date
        if rental_data.end_date is not None:
            rental.end_date = rental_data.end_date
        db.commit()
        db.refresh(rental)
    return rental

def delete_rental(db: Session, rental_id: int) -> bool:
    rental = get_rental_by_id(db, rental_id)
    if rental:
        db.delete(rental)
        db.commit()
        return True
    return False

def check_equipment_availability(db: Session, equipment_id: int, start_date: date, end_date: date) -> bool:
    overlapping_rentals = db.query(Rental).filter(
        and_(
            Rental.equipment_id == equipment_id,
            Rental.start_date <= end_date,
            Rental.end_date >= start_date
        )
    ).first()
    return overlapping_rentals is None

def get_active_rentals(db: Session, user_id: int) -> list[Rental]:
    return db.query(Rental).filter(
        and_(
            Rental.user_id == user_id,
            Rental.end_date >= date.today()
        )
    ).all()

def finish_rental(db: Session, rental_id: int) -> Rental:
    rental = get_rental_by_id(db, rental_id)
    if rental:
        equipment = db.query(Equipment).filter(Equipment.id == rental.equipment_id).first()
        if equipment:
            equipment.is_available = True
            stock_level = stock_level_service.get_stock_level_by_equipment_type(db, equipment.equipment_type_id)
            if stock_level:
                stock_level.available_count += 1
            db.commit()
    return rental

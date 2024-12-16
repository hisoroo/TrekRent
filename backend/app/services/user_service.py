from sqlalchemy.orm import Session
from typing import Optional, List
from fastapi import HTTPException, status

from app.core.password import get_password_hash, verify_password
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate, UserResponse

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user_data: UserCreate) -> User:
        if self.get_user_by_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        db_user = User(
            email=user_data.email,
            password=get_password_hash(user_data.password),
            firstname=user_data.firstname,
            lastname=user_data.lastname,
            phonenumber=user_data.phonenumber,
            street=user_data.street,
            house_number=user_data.house_number,
            apartment_number=user_data.apartment_number,
            postal_code=user_data.postal_code,
            city=user_data.city,
            country=user_data.country,
            user_group="user"
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = self.get_user_by_email(email)
        if not user or not verify_password(password, user.password):
            return None
        return user

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        update_data = user_data.dict(exclude_unset=True)
        
        if "password" in update_data:
            update_data["password"] = get_password_hash(update_data["password"])

        for field, value in update_data.items():
            setattr(user, field, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int) -> bool:
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        self.db.delete(user)
        self.db.commit()
        return True

    def change_password(self, user_id: int, old_password: str, new_password: str) -> bool:
        user = self.get_user_by_id(user_id)
        if not user or not verify_password(old_password, user.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid old password"
            )

        user.password = get_password_hash(new_password)
        self.db.commit()
        return True

    def change_user_group(self, user_id: int, new_group: str) -> User:
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        user.user_group = new_group
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_users_by_group(self, group: str) -> List[User]:
        return self.db.query(User).filter(User.user_group == group).all()

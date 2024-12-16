import jwt
from datetime import datetime, timedelta
from typing import Optional, Union
from .config import JWT_SECRET_KEY, JWT_ALGORITHM
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError
from ..services.user_service import UserService
from ..schemas.user import TokenPayload
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_access_token(*, data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        if token_data.sub is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception

    user_service = UserService(db)
    user = user_service.get_user_by_email(email=token_data.sub)
    if user is None:
        raise credentials_exception
    return user

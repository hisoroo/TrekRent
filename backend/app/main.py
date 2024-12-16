from fastapi import FastAPI
from .api import routes
from .db.session import engine
from .db.base import Base
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Podstawowe routery
app.include_router(routes.auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(routes.users.router, prefix="/api/users", tags=["users"])

# Routery związane ze sprzętem
app.include_router(routes.equipment.router, prefix="/api", tags=["equipment"])
app.include_router(routes.equipment_type.router, prefix="/api", tags=["equipment-types"])
app.include_router(routes.stock_level.router, prefix="/api", tags=["stock-levels"])

# Router wypożyczeń
app.include_router(routes.rentals.router, prefix="/api", tags=["rentals"])

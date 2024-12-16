from .users import router as users_router
from .equipment import router as equipment_router
from .rentals import router as rentals_router
from .auth import router as auth_router
from .equipment_type import router as equipment_type_router
from .stock_level import router as stock_level_router

__all__ = [
    "users_router",
    "equipment_router",
    "rentals_router",
    "auth_router",
    "equipment_type_router",
    "stock_level_router"
]

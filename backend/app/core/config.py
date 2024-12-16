import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = "postgresql://postgres:@localhost:5432/TrekRent"

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "111111")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "ES256")
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

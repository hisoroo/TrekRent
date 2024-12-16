import logging
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from ..core.config import DATABASE_URL

# Konfiguracja loggera
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

engine = create_engine(DATABASE_URL, echo=True, future=True)

@event.listens_for(engine, 'connect')
def receive_connect(dbapi_connection, connection_record):
    logger.info("Successfully connected to database!")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

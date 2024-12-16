from sqlalchemy.orm import Session
from app.initial_data import init_db
from app.db.base import Base
from app.db.session import engine
from app.models.user import User
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_database():
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    from app.db.session import SessionLocal
    db = SessionLocal()
    
    try:
        if db.query(User).first() is None:
            logger.info("Database is empty, initializing with default data...")
            init_db(db)
            logger.info("Database initialization completed!")
        else:
            logger.info("Database already contains data, skipping initialization")
    except Exception as e:
        logger.error(f"Error during database setup: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    setup_database()

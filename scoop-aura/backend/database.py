
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ==========================================
# PostgreSQL DATABASE CONFIGURATION
# ==========================================

DB_USER = "postgres"
DB_PASSWORD = "shivam123"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "scoop_aura"

DATABASE_URL = (
    f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ==========================================
# SQLALCHEMY ENGINE
# ==========================================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False
)

# ==========================================
# DATABASE SESSION
# ==========================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ==========================================
# DECLARATIVE BASE
# ==========================================

Base = declarative_base()


# ==========================================
# DATABASE SESSION DEPENDENCY
# ==========================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

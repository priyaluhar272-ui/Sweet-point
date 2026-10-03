from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from database import engine
import bcrypt
from ForgotPassword import router as forgot_password_router


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=
    [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forgot_password_router)

@app.get("/")
def root():
    return {
        "message": "FastAPI backend is running"
    }


@app.get("/test-db")
def test_database():

    try:

        with engine.connect() as connection:

            result = connection.execute(
                text("SELECT NOW()")
            )

            current_time = result.scalar()

        return {
            "message": "Database connected successfully",
            "time": current_time
        }

    except Exception as e:

        return {
            "message": "Database connection failed",
            "error": str(e)
        }


# Register request structure

class RegisterRequest(BaseModel):

    name: str
    email: str
    password: str


# REGISTER API

@app.post("/api/register")
def register_user(user: RegisterRequest):

    # Check if email already exists

    with engine.connect() as connection:

        result = connection.execute(
            text(
                "SELECT id FROM users WHERE email = :email"
            ),
            {
                "email": user.email
            }
        )

        existing_user = result.fetchone()


    if existing_user:

        return {
            "success": False,
            "message": "Email already registered."
        }


    # Hash password

    password_hash = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


    # Insert user

    with engine.begin() as connection:

        connection.execute(
            text("""
                INSERT INTO users
                (name, email, password_hash)
                VALUES
                (:name, :email, :password_hash)
            """),
            {
                "name": user.name,
                "email": user.email,
                "password_hash": password_hash
            }
        )


    return 
    {
        "success": True,
        "message": "Registration successful."
    }



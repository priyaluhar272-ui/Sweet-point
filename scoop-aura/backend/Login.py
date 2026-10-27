
import os
from datetime import datetime, timedelta, timezone

import bcrypt
import psycopg2
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from jose import jwt
from pydantic import BaseModel

load_dotenv()

router = APIRouter()

# Read database settings and JWT secret from .env
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "scoop_aura")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_PORT = os.getenv("DB_PORT", "5432")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


class LoginRequest(BaseModel):
    email: str
    password: str


def create_admin_token(email: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=30)

    payload = {
        "sub": email,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


@router.post("/login")
def login_user(data: LoginRequest):
    email = data.email.strip().lower()

    if not DB_PASSWORD:
        raise HTTPException(
            status_code=500,
            detail="Database configuration is missing.",
        )

    if not JWT_SECRET_KEY:
        raise HTTPException(
            status_code=500,
            detail="Admin authentication is not configured.",
        )

    connection = None

    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
        )

        with connection.cursor() as cursor:
            # 1. Check whether this email belongs to an admin.
            cursor.execute(
                """
                SELECT admin_id, email, password_hash
                FROM admins
                WHERE LOWER(email) = %s
                  AND is_active = TRUE
                """,
                (email,),
            )

            admin = cursor.fetchone()

            if admin:
                admin_id, admin_email, password_hash = admin

                try:
                    password_matches = bcrypt.checkpw(
                        data.password.encode("utf-8"),
                        password_hash.encode("utf-8"),
                    )
                except (ValueError, TypeError, AttributeError):
                    password_matches = False

                if not password_matches:
                    raise HTTPException(
                        status_code=401,
                        detail="Invalid credentials",
                    )

                # Admin authenticated successfully.
                token = create_admin_token(admin_email)

                return {
                    "success": True,
                    "role": "admin",
                    "access_token": token,
                    "token_type": "bearer",
                    "user": {
                        "id": admin_id,
                        "email": admin_email,
                    },
                }

            # 2. If not an admin, check the customer table.
            cursor.execute(
                """
                SELECT id, name, email, password_hash
                FROM users
                WHERE LOWER(email) = %s
                """,
                (email,),
            )

            user = cursor.fetchone()

            if user is None:
                raise HTTPException(
                    status_code=404,
                    detail="Email id is not registered !",
                )

            user_id, user_name, user_email, stored_hash = user

            try:
                password_matches = bcrypt.checkpw(
                    data.password.encode("utf-8"),
                    stored_hash.encode("utf-8"),
                )
            except (ValueError, TypeError, AttributeError):
                password_matches = False

            if not password_matches:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid credentials",
                )

            # Customer authenticated successfully.
            return {
                "success": True,
                "role": "customer",
                "user": {
                    "id": user_id,
                    "name": user_name,
                    "email": user_email,
                },
            }

    except HTTPException:
        raise

    except Exception as e:
        print("LOGIN ERROR:", e)
        raise HTTPException(
            status_code=500,
            detail="Internal server error",
        )

    finally:
        if connection is not None:
            connection.close()

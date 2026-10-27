
import os
import bcrypt

from datetime import datetime, timedelta, timezone
from typing import Annotated

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from sqlalchemy import text

from database import engine

load_dotenv()

router = APIRouter(prefix="/admin", tags=["Admin"])

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY missing from .env")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/admin/login")


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


def create_access_token(email: str):
    expires = datetime.now(timezone.utc) + timedelta(minutes=30)

    payload = {
        "sub": email,
        "exp": expires,
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )


def get_current_admin(
    token: Annotated[str, Depends(oauth2_scheme)]
):
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired admin session",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )
        email = payload.get("sub")

        if not email:
            raise credentials_error

    except JWTError:
        raise credentials_error

    with engine.connect() as connection:
        admin = connection.execute(
            text("""
                SELECT admin_id, email
                FROM admins
                WHERE email = :email AND is_active = TRUE
            """),
            {"email": email},
        ).mappings().first()

    if not admin:
        raise credentials_error

    return {
        "admin_id": admin["admin_id"],
        "email": admin["email"],
    }


@router.post("/login")
def admin_login(data: AdminLogin):
    email = str(data.email).strip().lower()

    with engine.connect() as connection:
        admin = connection.execute(
            text("""
                SELECT email, password_hash
                FROM admins
                WHERE email = :email AND is_active = TRUE
            """),
            {"email": email},
        ).mappings().first()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    try:
        password_matches = bcrypt.checkpw(
            data.password.encode("utf-8"),
            admin["password_hash"].encode("utf-8"),
        )
    except (ValueError, TypeError):
        password_matches = False

    if not password_matches:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = create_access_token(admin["email"])

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/me")
def get_admin_profile(
    admin: Annotated[dict, Depends(get_current_admin)]
):
    return admin

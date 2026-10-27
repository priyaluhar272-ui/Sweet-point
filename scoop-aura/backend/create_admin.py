
import os
import bcrypt

from dotenv import load_dotenv
from sqlalchemy import text
from database import engine

load_dotenv()

email = os.getenv("ADMIN_EMAIL")
password = os.getenv("ADMIN_PASSWORD")

if not email or not password:
    raise RuntimeError(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env"
    )

if len(password.encode("utf-8")) > 72:
    raise RuntimeError("Admin password is too long for bcrypt.")

password_hash = bcrypt.hashpw(
    password.encode("utf-8"),
    bcrypt.gensalt()
).decode("utf-8")

with engine.begin() as connection:
    connection.execute(
        text("""
            INSERT INTO admins (email, password_hash)
            VALUES (:email, :password_hash)
            ON CONFLICT (email) DO NOTHING
        """),
        {
            "email": email.strip().lower(),
            "password_hash": password_hash,
        },
    )

print("Admin setup completed. Check the admins table.")

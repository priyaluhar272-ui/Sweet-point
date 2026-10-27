from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from database import engine
import bcrypt
from Login import router as login_router
from ForgotPassword import router as forgot_password_router
from DeliveryAgent import router as delivery_agent_router
from Orders import router as orders_router
from Adminauth import router as admin_auth_router
from fastapi import HTTPException
from Items import router as items_router

app = FastAPI()

@app.get("/admin/customers")
def get_admin_customers():
    try:
        with engine.connect() as connection:
            rows = connection.execute(
                text("""
                    SELECT
                        u.id,
                        u.name,
                        u.email,
                        u.created_at AS joined_on,
                        COUNT(o.order_id) AS total_orders,
                        COALESCE(SUM(o.total_price), 0) AS total_spent
                    FROM users u
                    LEFT JOIN orders o
                        ON o.user_id = u.id
                    GROUP BY
                        u.id, u.name, u.email, u.created_at
                    ORDER BY u.created_at DESC NULLS LAST
                """)
            ).mappings().all()

        return {
            "success": True,
            "customers": [
                {
                    "id": row["id"],
                    "name": row["name"],
                    "email": row["email"],
                    "joined": (
                        row["joined_on"].strftime("%d %b %Y")
                        if row["joined_on"] else None
                    ),
                    "orders": row["total_orders"],
                    "spent": float(row["total_spent"]),
                    "status": "Registered"
                }
                for row in rows
            ]
        }

    except Exception as exc:
        print("Customer API error:", exc)
        raise HTTPException(
            status_code=500,
            detail="Unable to fetch customers."
        )

@app.get("/admin/dashboard/stats")
def get_admin_dashboard_stats():
    with engine.connect() as connection:
        total_customers = connection.execute(
            text("SELECT COUNT(*) FROM users")
        ).scalar_one()

        total_delivery_agents = connection.execute(
            text("SELECT COUNT(*) FROM delivery_agents")
        ).scalar_one()

    return {
        "success": True,
        "total_customers": total_customers,
        "total_delivery_agents": total_delivery_agents,
        "total_items": None,
        "total_flavours": None,
    }

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
app.include_router(delivery_agent_router)
app.include_router(orders_router)
app.include_router(admin_auth_router)
app.include_router(items_router)
# =========================
# LOGIN ROUTER
# =========================

app.include_router(login_router)

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



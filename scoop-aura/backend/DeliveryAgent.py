from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from database import engine
import bcrypt

router = APIRouter(prefix="/delivery-agent", tags=["Delivery Agent"])


class DeliveryAgentRegister(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    contact_number: str = Field(min_length=1, max_length=20)
    password: str = Field(min_length=8)


class DeliveryAgentLogin(BaseModel):
    email: EmailStr
    password: str


class DeliveryAgentLogout(BaseModel):
    agent_id: int = Field(gt=0)


class AgentStatusRequest(BaseModel):
    status: str


@router.on_event("startup")
def create_delivery_agent_table():
    with engine.begin() as connection:
        connection.execute(text("""
            CREATE TABLE IF NOT EXISTS delivery_agents (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                contact_number VARCHAR(20) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'Pending',
                is_online BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))
        connection.execute(text("""
            ALTER TABLE delivery_agents
            ADD COLUMN IF NOT EXISTS is_online BOOLEAN NOT NULL DEFAULT FALSE
        """))


@router.post("/register")
def register_delivery_agent(agent: DeliveryAgentRegister):
    name = agent.name.strip()
    email = str(agent.email).strip().lower()
    contact_number = agent.contact_number.strip()
    if not name or not contact_number:
        raise HTTPException(status_code=400, detail="Name and contact number are required.")

    password_hash = bcrypt.hashpw(agent.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    try:
        with engine.begin() as connection:
            result = connection.execute(text("""
                INSERT INTO delivery_agents
                    (name, email, contact_number, password_hash, status, is_online)
                VALUES (:name, :email, :contact_number, :password_hash, 'Pending', FALSE)
                RETURNING id, name, email, contact_number, status, is_online, created_at
            """), {
                "name": name,
                "email": email,
                "contact_number": contact_number,
                "password_hash": password_hash,
            }).mappings().one()
        return {
            "success": True,
            "message": "Delivery Agent registered successfully.",
            "agent": {
                **dict(result),
                "created_at": result["created_at"].isoformat() if result["created_at"] else None,
            },
        }
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Email or contact number is already registered.")
    except Exception as exc:
        print("Delivery agent registration error:", exc)
        raise HTTPException(status_code=500, detail="Unable to register delivery agent.")


@router.post("/login")
def login_delivery_agent(agent: DeliveryAgentLogin):
    email = str(agent.email).strip().lower()
    with engine.connect() as connection:
        result = connection.execute(text("""
            SELECT id, name, email, contact_number, password_hash, status
            FROM delivery_agents
            WHERE email = :email
        """), {"email": email}).mappings().first()

    if not result:
        raise HTTPException(status_code=401, detail="Email is not registered.")
    try:
        password_matches = bcrypt.checkpw(
            agent.password.encode("utf-8"), result["password_hash"].encode("utf-8")
        )
    except (ValueError, TypeError):
        password_matches = False
    if not password_matches:
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    if (result["status"] or "").lower() != "active":
        raise HTTPException(status_code=403, detail="Your delivery-agent account is not Active yet.")

    with engine.begin() as connection:
        connection.execute(text("UPDATE delivery_agents SET is_online = TRUE WHERE id = :agent_id"),
                           {"agent_id": result["id"]})
    return {
        "success": True,
        "message": "Login successful.",
        "agent": {
            "id": result["id"],
            "name": result["name"],
            "email": result["email"],
            "contact_number": result["contact_number"],
            "status": result["status"],
            "is_online": True,
        },
    }


@router.get("/admin/list")
def get_delivery_agents():
    try:
        with engine.connect() as connection:
            rows = connection.execute(text("""
                SELECT id, name, email, contact_number, status, is_online, created_at
                FROM delivery_agents
                ORDER BY created_at DESC NULLS LAST, id DESC
            """)).mappings().all()
        agents = []
        for row in rows:
            item = dict(row)
            item["created_at"] = item["created_at"].isoformat() if item["created_at"] else None
            agents.append(item)
        return {"success": True, "total": len(agents), "agents": agents}
    except Exception as exc:
        print("Error fetching delivery agents:", exc)
        raise HTTPException(status_code=500, detail="Unable to fetch delivery agents.")


@router.get("/admin/active")
def get_active_delivery_agents():
    try:
        with engine.connect() as connection:
            rows = connection.execute(text("""
                SELECT id, name, email, contact_number
                FROM delivery_agents
                WHERE LOWER(status) = 'active' AND is_online = TRUE
                ORDER BY name ASC
            """)).mappings().all()
        return {"success": True, "agents": [dict(row) for row in rows]}
    except Exception as exc:
        print("Active delivery agents API error:", exc)
        raise HTTPException(status_code=500, detail="Unable to fetch active delivery agents.")


@router.get("/{agent_id}/orders")
def get_orders_assigned_to_agent(agent_id: int):
    """Only return rows whose delivery_agent_id matches the requested agent."""
    try:
        with engine.connect() as connection:
            agent = connection.execute(text("SELECT id FROM delivery_agents WHERE id = :id"),
                                       {"id": agent_id}).first()
            if not agent:
                raise HTTPException(status_code=404, detail="Delivery agent not found.")
            rows = connection.execute(text("""
                SELECT
                    o.order_id, o.flavour, o.item_name, o.quantity, o.total_price,
                    o.user_id, o.status, o.created_at, o.assigned_at,
                    u.name AS customer_name, u.email AS customer_email
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                WHERE o.delivery_agent_id = :agent_id
                ORDER BY o.assigned_at DESC NULLS LAST, o.order_id DESC
            """), {"agent_id": agent_id}).mappings().all()
        orders = []
        for row in rows:
            item = dict(row)
            for field in ("created_at", "assigned_at"):
                item[field] = item[field].isoformat() if item[field] else None
            orders.append(item)
        return {"success": True, "total": len(orders), "orders": orders}
    except HTTPException:
        raise
    except Exception as exc:
        print("Assigned orders fetch error:", exc)
        raise HTTPException(status_code=500, detail="Unable to fetch assigned orders.")


@router.patch("/{agent_id}/status")
def update_agent_status(agent_id: int, request: AgentStatusRequest):
    # Availability UI only; account approval status should normally be admin-controlled.
    status = request.status.strip().title()
    if status not in {"Active", "Offline", "Inactive"}:
        raise HTTPException(status_code=400, detail="Status must be Active, Offline, or Inactive.")
    try:
        with engine.begin() as connection:
            result = connection.execute(text("""
                UPDATE delivery_agents
                SET is_online = CASE WHEN :status = 'Active' THEN TRUE ELSE FALSE END
                WHERE id = :agent_id
                RETURNING id, status, is_online
            """), {"status": status, "agent_id": agent_id}).mappings().first()
            if not result:
                raise HTTPException(status_code=404, detail="Delivery agent not found.")
        return {"success": True, "agent_id": result["id"], "status": result["status"], "is_online": result["is_online"]}
    except HTTPException:
        raise
    except Exception as exc:
        print("Update delivery agent status error:", exc)
        raise HTTPException(status_code=500, detail="Unable to update delivery-agent availability.")


@router.delete("/admin/{agent_id}")
def delete_delivery_agent(agent_id: int):
    try:
        with engine.begin() as connection:
            agent = connection.execute(text("SELECT id, name FROM delivery_agents WHERE id = :id"),
                                       {"id": agent_id}).mappings().first()
            if not agent:
                raise HTTPException(status_code=404, detail="Delivery agent not found.")
            # Orders are preserved; their delivery_agent_id is set NULL by FK.
            connection.execute(text("DELETE FROM delivery_agents WHERE id = :id"), {"id": agent_id})
        return {"success": True, "message": f"Delivery agent '{agent['name']}' deleted successfully.",
                "deleted_agent_id": agent_id}
    except HTTPException:
        raise
    except IntegrityError:
        raise HTTPException(status_code=409, detail="This delivery agent is linked to other records and cannot be deleted.")
    except Exception as exc:
        print("Delete delivery agent error:", exc)
        raise HTTPException(status_code=500, detail="Unable to delete delivery agent.")


@router.post("/logout")
def logout_delivery_agent(data: DeliveryAgentLogout):
    with engine.begin() as connection:
        result = connection.execute(text("""
            UPDATE delivery_agents SET is_online = FALSE WHERE id = :agent_id
        """), {"agent_id": data.agent_id})
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Delivery agent not found.")
    return {"success": True, "message": "Delivery agent logged out successfully."}

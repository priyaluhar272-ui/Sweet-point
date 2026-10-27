from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import text
from database import engine

router = APIRouter(prefix="/orders", tags=["Orders"])


class OrderItem(BaseModel):
    flavour: str = Field(min_length=1, max_length=150)
    item_name: str = Field(min_length=1, max_length=200)
    quantity: int = Field(gt=0)
    total_price: float = Field(ge=0)


class OrderRequest(BaseModel):
    # Send the logged-in customer's users.id from the checkout page.
    # Optional for backward compatibility with an older checkout; such orders
    # will show as "Unknown customer" until they are linked to a user.
    user_id: Optional[int] = None
    items: List[OrderItem] = Field(min_length=1)


class AssignOrderRequest(BaseModel):
    delivery_agent_id: int = Field(gt=0)


class UpdateOrderStatusRequest(BaseModel):
    status: str


VALID_ORDER_STATUSES = {"Preparing", "Out for delivery", "Delivered", "Cancelled"}


def _ensure_order_columns(connection):
    """Add non-destructive columns needed for order history and assignment."""
    connection.execute(text("""
        ALTER TABLE orders
        ADD COLUMN IF NOT EXISTS delivery_agent_id INTEGER
            REFERENCES delivery_agents(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'Preparing',
        ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    """))


@router.on_event("startup")
def ensure_orders_schema():
    # delivery_agents is created by DeliveryAgent.py startup too; create it here
    # only if necessary so the FK can be added even if router startup order differs.
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
        _ensure_order_columns(connection)


@router.post("/create")
def create_order(order: OrderRequest):
    try:
        with engine.begin() as connection:
            if order.user_id is not None:
                user_exists = connection.execute(
                    text("SELECT id FROM users WHERE id = :user_id"),
                    {"user_id": order.user_id},
                ).first()
                if not user_exists:
                    raise HTTPException(status_code=404, detail="Customer not found.")

            created_orders = []
            for item in order.items:
                result = connection.execute(
                    text("""
                        INSERT INTO orders
                            (flavour, item_name, quantity, total_price, user_id, status, created_at)
                        VALUES
                            (:flavour, :item_name, :quantity, :total_price, :user_id,
                             'Preparing', CURRENT_TIMESTAMP)
                        RETURNING order_id, flavour, item_name, quantity, total_price,
                                  user_id, status, created_at
                    """),
                    {
                        "flavour": item.flavour.strip(),
                        "item_name": item.item_name.strip(),
                        "quantity": item.quantity,
                        "total_price": item.total_price,
                        "user_id": order.user_id,
                    },
                ).mappings().one()
                created_orders.append({
                    **dict(result),
                    "created_at": result["created_at"].isoformat() if result["created_at"] else None,
                })

        return {
            "success": True,
            "message": "Order saved successfully.",
            "orders": created_orders,
        }
    except HTTPException:
        raise
    except Exception as exc:
        print("Create order error:", exc)
        raise HTTPException(status_code=500, detail="Failed to save order.")


@router.get("/admin/list")
def get_all_orders_for_admin():
    """Return real orders and their customer names for the admin orders page."""
    try:
        with engine.connect() as connection:
            rows = connection.execute(text("""
                SELECT
                    o.order_id,
                    o.flavour,
                    o.item_name,
                    o.quantity,
                    o.total_price,
                    o.user_id,
                    o.status,
                    o.delivery_agent_id,
                    o.assigned_at,
                    o.created_at,
                    u.name AS customer_name,
                    u.email AS customer_email,
                    da.name AS delivery_agent_name
                FROM orders o
                LEFT JOIN users u ON u.id = o.user_id
                LEFT JOIN delivery_agents da ON da.id = o.delivery_agent_id
                ORDER BY o.created_at DESC NULLS LAST, o.order_id DESC
            """)).mappings().all()

        orders = []
        for row in rows:
            item = dict(row)
            for field in ("created_at", "assigned_at"):
                if item[field] is not None:
                    item[field] = item[field].isoformat()
            orders.append(item)
        return {"success": True, "total": len(orders), "orders": orders}
    except Exception as exc:
        print("Admin orders fetch error:", exc)
        raise HTTPException(status_code=500, detail="Unable to fetch orders.")


@router.post("/{order_id}/assign")
def assign_order_to_delivery_agent(order_id: int, request: AssignOrderRequest):
    """Persist an order assignment; only active, online agents can be assigned."""
    try:
        with engine.begin() as connection:
            order_row = connection.execute(
                text("SELECT order_id, status FROM orders WHERE order_id = :order_id FOR UPDATE"),
                {"order_id": order_id},
            ).mappings().first()
            if not order_row:
                raise HTTPException(status_code=404, detail="Order not found.")
            if (order_row["status"] or "").lower() == "cancelled":
                raise HTTPException(status_code=409, detail="Cancelled orders cannot be assigned.")

            agent = connection.execute(text("""
                SELECT id, name
                FROM delivery_agents
                WHERE id = :agent_id
                  AND LOWER(status) = 'active'
                  AND is_online = TRUE
            """), {"agent_id": request.delivery_agent_id}).mappings().first()
            if not agent:
                raise HTTPException(
                    status_code=400,
                    detail="Selected delivery agent must be Active and Online.",
                )

            connection.execute(text("""
                UPDATE orders
                SET delivery_agent_id = :agent_id,
                    assigned_at = CURRENT_TIMESTAMP,
                    status = CASE WHEN status = 'Cancelled' THEN status ELSE 'Preparing' END
                WHERE order_id = :order_id
            """), {"agent_id": request.delivery_agent_id, "order_id": order_id})

        return {
            "success": True,
            "message": f"Order #{order_id} assigned to {agent['name']}.",
            "order_id": order_id,
            "delivery_agent_id": request.delivery_agent_id,
        }
    except HTTPException:
        raise
    except Exception as exc:
        print("Assign order error:", exc)
        raise HTTPException(status_code=500, detail="Unable to assign order.")


@router.post("/{order_id}/reject")
def reject_order(order_id: int):
    """Admin rejection marks the order cancelled instead of deleting history."""
    try:
        with engine.begin() as connection:
            result = connection.execute(text("""
                UPDATE orders
                SET status = 'Cancelled'
                WHERE order_id = :order_id
                RETURNING order_id
            """), {"order_id": order_id}).first()
            if not result:
                raise HTTPException(status_code=404, detail="Order not found.")
        return {"success": True, "message": f"Order #{order_id} marked as Cancelled."}
    except HTTPException:
        raise
    except Exception as exc:
        print("Reject order error:", exc)
        raise HTTPException(status_code=500, detail="Unable to reject order.")


@router.patch("/{order_id}/status")
def update_order_status(order_id: int, request: UpdateOrderStatusRequest):
    """Status endpoint for future delivery-agent status controls."""
    status = request.status.strip().title()
    if status not in VALID_ORDER_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid order status.")
    try:
        with engine.begin() as connection:
            result = connection.execute(text("""
                UPDATE orders
                SET status = :status
                WHERE order_id = :order_id
                RETURNING order_id, status
            """), {"status": status, "order_id": order_id}).mappings().first()
            if not result:
                raise HTTPException(status_code=404, detail="Order not found.")
        return {"success": True, "order_id": result["order_id"], "status": result["status"]}
    except HTTPException:
        raise
    except Exception as exc:
        print("Update order status error:", exc)
        raise HTTPException(status_code=500, detail="Unable to update order status.")

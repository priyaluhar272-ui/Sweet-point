
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import text
from database import engine

router = APIRouter(prefix="/items", tags=["Manage Items"])


class ItemRequest(BaseModel):
    item_name: str = Field(min_length=1, max_length=150)
    description: str = ""
    price: float = Field(ge=0)
    flavour_id: int | None = None
    is_available: bool = True
    image_url: str | None = None


def serialize_item(row):
    item = dict(row)
    item["price"] = float(item["price"])
    return item


@router.get("/flavours")
def get_flavours():
    try:
        with engine.connect() as connection:
            rows = connection.execute(
                text("""
                    SELECT id, flavour_name
                    FROM flavours
                    WHERE is_available = TRUE
                    ORDER BY flavour_name
                """)
            ).mappings().all()

            return [dict(row) for row in rows]

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Could not fetch flavours: {str(exc)}"
        )


@router.get("/")
def get_items():
    try:
        with engine.connect() as connection:
            rows = connection.execute(
                text("""
                    SELECT
                        i.id,
                        i.item_name,
                        i.description,
                        i.price,
                        i.flavour_id,
                        i.is_available,
                        i.created_at,
                        i.image_url,
                        f.flavour_name
                    FROM items i
                    LEFT JOIN flavours f ON f.id = i.flavour_id
                    ORDER BY i.id DESC
                """)
            ).mappings().all()

            return [serialize_item(row) for row in rows]

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Could not fetch items: {str(exc)}"
        )


@router.post("/")
def create_item(item: ItemRequest):
    name = item.item_name.strip()

    if not name:
        raise HTTPException(
            status_code=422,
            detail="Item name is required."
        )

    try:
        with engine.begin() as connection:
            if item.flavour_id is not None:
                flavour = connection.execute(
                    text("SELECT id FROM flavours WHERE id = :id"),
                    {"id": item.flavour_id},
                ).first()

                if not flavour:
                    raise HTTPException(
                        status_code=400,
                        detail="Selected flavour does not exist."
                    )

            row = connection.execute(
                text("""
                    INSERT INTO items
                        (
                            item_name,
                            description,
                            price,
                            flavour_id,
                            is_available,
                            image_url
                        )
                    VALUES
                        (
                            :item_name,
                            :description,
                            :price,
                            :flavour_id,
                            :is_available,
                            :image_url
                        )
                    RETURNING
                        id,
                        item_name,
                        description,
                        price,
                        flavour_id,
                        is_available,
                        created_at,
                        image_url
                """),
                {
                    "item_name": name,
                    "description": item.description,
                    "price": item.price,
                    "flavour_id": item.flavour_id,
                    "is_available": item.is_available,
                    "image_url": item.image_url,
                },
            ).mappings().one()

            result = serialize_item(row)

            if result["flavour_id"] is not None:
                result["flavour_name"] = connection.execute(
                    text("""
                        SELECT flavour_name
                        FROM flavours
                        WHERE id = :id
                    """),
                    {"id": result["flavour_id"]},
                ).scalar_one_or_none()
            else:
                result["flavour_name"] = None

            return result

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Could not create item: {str(exc)}"
        )


@router.put("/{item_id}")
def update_item(item_id: int, item: ItemRequest):
    name = item.item_name.strip()

    if not name:
        raise HTTPException(
            status_code=422,
            detail="Item name is required."
        )

    try:
        with engine.begin() as connection:
            exists = connection.execute(
                text("SELECT id FROM items WHERE id = :id"),
                {"id": item_id},
            ).first()

            if not exists:
                raise HTTPException(
                    status_code=404,
                    detail="Item not found."
                )

            if item.flavour_id is not None:
                flavour = connection.execute(
                    text("SELECT id FROM flavours WHERE id = :id"),
                    {"id": item.flavour_id},
                ).first()

                if not flavour:
                    raise HTTPException(
                        status_code=400,
                        detail="Selected flavour does not exist."
                    )

            row = connection.execute(
                text("""
                    UPDATE items
                    SET
                        item_name = :item_name,
                        description = :description,
                        price = :price,
                        flavour_id = :flavour_id,
                        is_available = :is_available,
                        image_url = :image_url
                    WHERE id = :id
                    RETURNING
                        id,
                        item_name,
                        description,
                        price,
                        flavour_id,
                        is_available,
                        created_at,
                        image_url
                """),
                {
                    "id": item_id,
                    "item_name": name,
                    "description": item.description,
                    "price": item.price,
                    "flavour_id": item.flavour_id,
                    "is_available": item.is_available,
                    "image_url": item.image_url,
                },
            ).mappings().one()

            result = serialize_item(row)

            result["flavour_name"] = (
                connection.execute(
                    text("""
                        SELECT flavour_name
                        FROM flavours
                        WHERE id = :id
                    """),
                    {"id": result["flavour_id"]},
                ).scalar_one_or_none()
                if result["flavour_id"] is not None
                else None
            )

            return result

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Could not update item: {str(exc)}"
        )


@router.delete("/{item_id}")
def delete_item(item_id: int):
    try:
        with engine.begin() as connection:
            result = connection.execute(
                text("DELETE FROM items WHERE id = :id"),
                {"id": item_id},
            )

            if result.rowcount == 0:
                raise HTTPException(
                    status_code=404,
                    detail="Item not found."
                )

        return {
            "success": True,
            "message": "Item deleted successfully."
        }

    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Could not delete item: {str(exc)}"
        )

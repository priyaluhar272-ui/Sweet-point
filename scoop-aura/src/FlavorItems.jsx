
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FlavorItems.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const normalize = (value = "") =>
  String(value).toLowerCase().replace(/[^a-z0-9]/g, "");

// Convert database image path into a usable image URL
const getImageUrl = (product) => {
  const imagePath = product.image_url || product.image || "";

  if (!imagePath || typeof imagePath !== "string") {
    return "";
  }

  const path = imagePath.trim();

  if (!path) return "";

  // Image URL is already absolute
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Relative image path served by Vite
  return `http://localhost:5173${
    path.startsWith("/") ? "" : "/"
  }${path}`;
};

function FlavorItems() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedFlavor = location.state?.flavor || "Butterscotch";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadItems() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/items/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Items API failed (${response.status}). Backend ke /items/ endpoint ko check karo.`
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("GET /items/ se JSON list return nahi hui.");
        }

        console.log("Items API response:", data);

        const availableItems = data.filter((item) => {
          if (
            item.is_available === undefined ||
            item.is_available === null
          ) {
            return true;
          }

          return (
            item.is_available === true ||
            item.is_available === 1 ||
            String(item.is_available).toLowerCase() === "true"
          );
        });

        setItems(availableItems);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Flavor items load error:", err);
          setError(err.message || "Items load nahi ho paaye.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => controller.abort();
  }, []);

  const flavorItems = useMemo(() => {
    const wanted = normalize(selectedFlavor);

    return items.filter((item) => {
      const itemFlavor =
        item.flavour_name ??
        item.flavor_name ??
        item.flavour ??
        item.flavor ??
        item.flavourName ??
        item.flavorName ??
        "";

      return normalize(itemFlavor) === wanted;
    });
  }, [items, selectedFlavor]);

  const addToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.item_name || product.name || "Ice Cream",
      flavor:
        product.flavour_name ||
        product.flavor_name ||
        product.flavour ||
        product.flavor ||
        selectedFlavor,
      price: Number(product.price || 0),
      quantity: 1,
      image: getImageUrl(product),
    };

    try {
      const savedCart = JSON.parse(
        localStorage.getItem("scoopAuraCart") || "[]"
      );

      const currentCart = Array.isArray(savedCart) ? savedCart : [];

      const existing = currentCart.find(
        (item) => String(item.id) === String(cartItem.id)
      );

      const updatedCart = existing
        ? currentCart.map((item) =>
            String(item.id) === String(cartItem.id)
              ? {
                  ...item,
                  quantity: Number(item.quantity || 1) + 1,
                }
              : item
          )
        : [...currentCart, cartItem];

      localStorage.setItem(
        "scoopAuraCart",
        JSON.stringify(updatedCart)
      );

      setMessage(`${cartItem.name} added to your cart.`);
    } catch (err) {
      console.error("Cart save error:", err);
      setMessage("Cart update nahi hua. Browser storage check karo.");
    }
  };

  return (
    <main className="flavor-items-page">
      <header className="fi-topbar">
        <button
          className="fi-back-button"
          onClick={() => navigate("/flavormenu")}
        >
          ← Back to Flavours
        </button>

        <div className="fi-brand">
          🍦 <span>ScoopAura</span>
        </div>

        <button
          className="fi-cart-button"
          onClick={() => navigate("/dashboard")}
        >
          🛒 View Cart
        </button>
      </header>

      <section className="fi-heading">
        <span className="fi-eyebrow">MADE WITH LOVE ♥</span>
        <h1>
          {selectedFlavor} <span>Collection</span>
        </h1>
        <p>
          Explore the items available in our {selectedFlavor} flavour.
        </p>
      </section>

      {message && (
        <div className="fi-message" role="status">
          {message}
          <button
            onClick={() => setMessage("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="fi-state">
          <span className="fi-spinner" />
          <p>Loading {selectedFlavor} items...</p>
        </div>
      ) : error ? (
        <div className="fi-state fi-error">
          <h2>Items load nahi ho paaye</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : flavorItems.length === 0 ? (
        <div className="fi-state fi-empty">
          <div>🍨</div>
          <h2>No {selectedFlavor} items found</h2>
          <p>
            Admin ke Manage Items page par item ka flavour{" "}
            <strong>{selectedFlavor}</strong> select karke save karo,
            aur item available hona chahiye.
          </p>
          <button onClick={() => navigate("/flavormenu")}>
            Explore Other Flavours
          </button>
        </div>
      ) : (
        <section
          className="fi-product-grid"
          aria-label={`${selectedFlavor} items`}
        >
          {flavorItems.map((product) => {
            const imageUrl = getImageUrl(product);

            return (
              <article className="fi-product-card" key={product.id}>
                <div className="fi-product-image">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={
                        product.item_name ||
                        product.name ||
                        "Ice cream"
                      }
                      onError={(event) => {
                        console.error(
                          "Image load failed:",
                          event.currentTarget.src,
                          "Database image_url:",
                          product.image_url
                        );
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span aria-hidden="true">🍨</span>
                  )}

                  <span className="fi-flavour-tag">
                    {selectedFlavor}
                  </span>
                </div>

                <div className="fi-product-content">
                  <h2>
                    {product.item_name || product.name || "Ice Cream"}
                  </h2>

                  <p>
                    {product.description ||
                      "A delicious ScoopAura treat."}
                  </p>

                  <div className="fi-product-bottom">
                    <strong>
                      ₹{Number(product.price || 0).toFixed(2)}
                    </strong>

                    <button onClick={() => addToCart(product)}>
                      ＋ Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <footer className="fi-footer">
        ScoopAura · Freshly made with love ♥
      </footer>
    </main>
  );
}

export default FlavorItems;

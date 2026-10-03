
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FlavorItems.css";

// Load all images from src/falvoricecream
const imageModules = import.meta.glob("./falvoricecream/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const normalize = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const files = Object.entries(imageModules).map(([path, image]) => {
  const filename = path.split("/").pop();
  const extension = filename.includes(".")
    ? filename.substring(filename.lastIndexOf("."))
    : "";

  const rawName = extension
    ? filename.substring(0, filename.lastIndexOf("."))
    : filename;

  return {
    id: path,
    image,
    filename: rawName,
    normalized: normalize(rawName),
  };
});

const flavors = [
  {
    name: "Chocolate",
    aliases: ["chocolate", "choclate", "chocate"],
    price: 120,
    emoji: "🍫",
  },
  {
    name: "Strawberry",
    aliases: ["strawberry", "strawbery"],
    price: 110,
    emoji: "🍓",
  },
  {
    name: "Butterscotch",
    aliases: ["butterscotch"],
    price: 115,
    emoji: "🍮",
  },
  {
    name: "Mango",
    aliases: ["mango"],
    price: 115,
    emoji: "🥭",
  },
  {
    name: "Brownie Fudge",
    aliases: ["browniefudge", "rowniefudge"],
    price: 150,
    emoji: "🍫",
  },
  {
    name: "Black Currant",
    aliases: ["blackcurrant"],
    price: 125,
    emoji: "🫐",
  },
  {
    name: "Kesar Pista",
    aliases: ["kesarpista"],
    price: 140,
    emoji: "💚",
  },
  {
    name: "Rajbhog",
    aliases: ["rajbhog"],
    price: 135,
    emoji: "👑",
  },
  {
    name: "Cookies & Cream",
    aliases: ["cookiescream"],
    price: 130,
    emoji: "🍪",
  },
  {
    name: "Choco Chip",
    aliases: ["chocochip"],
    price: 125,
    emoji: "🍫",
  },
  {
    name: "Mint Chocolate",
    aliases: ["mintchocolate"],
    price: 125,
    emoji: "🌿",
  },
  {
    name: "Blueberry",
    aliases: ["blueberry"],
    price: 130,
    emoji: "🫐",
  },
  {
    name: "Coffee",
    aliases: ["coffee"],
    price: 120,
    emoji: "☕",
  },
  {
    name: "Caramel",
    aliases: ["caramel"],
    price: 125,
    emoji: "🍯",
  },
  {
    name: "Vanilla",
    aliases: ["vanilla", "vanila"],
    price: 90,
    emoji: "🍨",
  },
];

// Match each filename to the most specific flavor.
// For example, Mint Chocolate images won't appear under Chocolate.
const getMatchedFlavor = (file) => {
  const matches = flavors.flatMap((flavor) =>
    flavor.aliases
      .filter((alias) => file.normalized.includes(normalize(alias)))
      .map((alias) => ({
        flavor,
        length: normalize(alias).length,
      }))
  );

  matches.sort((a, b) => b.length - a.length);
  return matches[0]?.flavor ?? null;
};

const getProductName = (filename, flavor, index) => {
  const cleanName = filename
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Use the image filename as the product name.
  // If the filename is just a flavor name, add a number.
  if (normalize(cleanName) === normalize(flavor.name)) {
    return `${flavor.name} Special ${index + 1}`;
  }

  return cleanName.replace(/\b\w/g, (letter) => letter.toUpperCase());
};

function FlavorItems() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedFlavorName = location.state?.flavor;

  const [addedIds, setAddedIds] = useState([]);

  const selectedFlavor = flavors.find(
    (flavor) =>
      normalize(flavor.name) === normalize(selectedFlavorName || "")
  );

  const products = useMemo(() => {
    if (!selectedFlavor) return [];

    return files
      .filter((file) => getMatchedFlavor(file)?.name === selectedFlavor.name)
      .sort((a, b) => a.filename.localeCompare(b.filename))
      .map((file, index) => ({
        ...file,
        name: getProductName(file.filename, selectedFlavor, index),
        price: selectedFlavor.price + index * 10,
      }));
  }, [selectedFlavor]);

  const addToCart = (product, goToCart = false) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      flavor: selectedFlavor.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    };

    try {
      const existingCart = JSON.parse(
        localStorage.getItem("scoopAuraCart") || "[]"
      );

      const cart = Array.isArray(existingCart) ? existingCart : [];
      const existingItem = cart.find((item) => item.id === cartItem.id);

      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: (Number(item.quantity) || 0) + 1 }
            : item
        );
      } else {
        updatedCart = [...cart, cartItem];
      }

      localStorage.setItem("scoopAuraCart", JSON.stringify(updatedCart));

      setAddedIds((previous) => [...previous, product.id]);

      if (goToCart) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Unable to save cart:", error);
      window.alert("Cart save nahi hua. Please try again.");
    }
  };

  if (!selectedFlavor) {
    return (
      <main className="items-page">
        <div className="items-empty">
          <h2>🍦 Please select a flavor</h2>
          <p>Go back and choose your favorite ice cream flavor.</p>
          <button onClick={() => navigate("/flavormenu")}>
            ← Back to Flavors
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="items-page">
      <header className="items-header">
        <button
          className="items-back"
          onClick={() => navigate("/flavormenu")}
        >
          ← All Flavors
        </button>

        <div className="items-logo">🍦 ScoopAura</div>

        <button
          className="items-cart"
          onClick={() => navigate("/dashboard")}
        >
          🛒 View Cart
        </button>
      </header>

      <section className="items-hero">
        <span className="items-kicker">MADE WITH LOVE ♥</span>
        <h1>
          {selectedFlavor.emoji} {selectedFlavor.name}{" "}
          <span>Collection</span>
        </h1>
        <p>
          Discover every delicious {selectedFlavor.name.toLowerCase()} treat.
        </p>
        <div className="items-count">
          {products.length} {products.length === 1 ? "item" : "items"} found
        </div>
      </section>

      {products.length > 0 ? (
        <section className="items-grid">
          {products.map((product, index) => (
            <article className="item-card" key={product.id}>
              <div className="item-image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="item-image"
                  loading="lazy"
                />
                <span className="item-badge">Fresh & Delicious</span>
              </div>

              <div className="item-details">
                <span className="item-number">
                  ITEM {String(index + 1).padStart(2, "0")}
                </span>

                <h2>{product.name}</h2>
                <p className="item-description">
                  Creamy, delicious {selectedFlavor.name.toLowerCase()} ice cream.
                </p>

                <div className="item-buy-row">
                  <strong className="item-price">₹{product.price}</strong>
                  <span className="item-unit">per item</span>
                </div>

                <button
                  className="item-add-btn"
                  onClick={() => addToCart(product)}
                >
                  {addedIds.includes(product.id)
                    ? "✓ Added to Cart"
                    : "🛒 Add to Cart"}
                </button>

                <button
                  className="item-buy-btn"
                  onClick={() => addToCart(product, true)}
                >
                  Buy Now →
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="items-empty">
          <div className="empty-emoji">{selectedFlavor.emoji}</div>
          <h2>No matching images found</h2>
          <p>
            Please check that your {selectedFlavor.name} images are inside
            <code> src/falvoricecream </code> and their filenames contain the
            flavor name.
          </p>
          <button onClick={() => navigate("/flavormenu")}>
            ← Choose Another Flavor
          </button>
        </section>
      )}

      <footer className="items-footer">
        🍦 Scoops of happiness, made just for you. ♥
      </footer>
    </main>
  );
}

export default FlavorItems;
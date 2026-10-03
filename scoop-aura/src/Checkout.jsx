
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopPages.css";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cash on Delivery");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("scoopAuraCart") || "[]"));

    const user = JSON.parse(
      localStorage.getItem("scoopAuraUser") || "{}"
    );

    setCustomerName(user.name || user.fullName || "");
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const placeOrder = () => {
    if (!cart.length) {
      setMessage("Your cart is empty. Please add an ice cream first.");
      return;
    }

    if (!customerName.trim() || !address.trim()) {
      setMessage("Please enter your name and delivery address.");
      return;
    }

    const order = {
      id: Date.now(),
      customerName,
      address,
      payment,
      items: cart,
      total,
      date: new Date().toLocaleString(),
      status: "Placed",
    };

    const oldOrders = JSON.parse(
      localStorage.getItem("scoopAuraOrders") || "[]"
    );

    localStorage.setItem(
      "scoopAuraOrders",
      JSON.stringify([order, ...oldOrders])
    );

    localStorage.setItem("scoopAuraCart", "[]");

    navigate("/order-history", {
      state: { orderPlaced: true },
    });
  };

  return (
    <div className="shop-page">
      <button className="shop-back" onClick={() => navigate("/dashboard")}>
        ← Dashboard
      </button>

      <div className="shop-panel">
        <h1>🛍️ Checkout</h1>
        <p>Complete your ScoopAura order.</p>

        <h2>Your Items</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div className="shop-row" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p>Quantity: {item.quantity || 1}</p>
              </div>
              <strong>
                ₹{Number(item.price || 0) * Number(item.quantity || 1)}
              </strong>
            </div>
          ))
        )}

        <div className="shop-total">
          Total Amount <strong>₹{total}</strong>
        </div>

        <label htmlFor="customer-name">Your Name</label>
        <input
          id="customer-name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter your name"
        />

        <label htmlFor="delivery-address">Delivery Address</label>
        <textarea
          id="delivery-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your delivery address"
        />

        <label htmlFor="payment-method">Payment Method</label>
        <select
          id="payment-method"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
        >
          <option>Cash on Delivery</option>
          <option>Pay at Shop</option>
        </select>

        {message && <p className="shop-message">{message}</p>}

        <button
          className="shop-primary"
          onClick={placeOrder}
          disabled={cart.length === 0}
        >
          Place Order · ₹{total}
        </button>

        <p className="shop-note">
          Demo checkout: this saves the order in your browser. No actual
          payment is collected.
        </p>
      </div>
    </div>
  );
}
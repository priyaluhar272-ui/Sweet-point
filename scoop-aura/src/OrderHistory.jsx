
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ShopPages.css";

export default function OrderHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(
      JSON.parse(localStorage.getItem("scoopAuraOrders") || "[]")
    );
  }, []);

  return (
    <div className="shop-page">
      <button className="shop-back" onClick={() => navigate("/dashboard")}>
        ← Dashboard
      </button>

      <div className="shop-panel">
        {location.state?.orderPlaced && (
          <div className="shop-success">
            ✅ Your order has been saved successfully!
          </div>
        )}

        <h1>🧾 Order History</h1>
        <p>Your previous ScoopAura orders.</p>

        {orders.length === 0 ? (
          <div className="shop-empty">
            <span>🍦</span>
            <h2>No orders yet</h2>
            <p>Your completed checkout orders will appear here.</p>
            <button
              className="shop-primary"
              onClick={() => navigate("/flavormenu")}
            >
              Explore Flavors
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div className="shop-order" key={order.id}>
              <div className="shop-order-heading">
                <h3>Order #{String(order.id).slice(-6)}</h3>
                <span className="shop-status">{order.status}</span>
              </div>

              <p>Date: {order.date}</p>
              <p>Customer: {order.customerName}</p>

              <div className="shop-order-items">
                {(order.items || []).map((item, index) => (
                  <div key={`${order.id}-${item.id}-${index}`}>
                    <span>
                      {item.name} × {item.quantity || 1}
                    </span>
                    <strong>
                      ₹{Number(item.price || 0) *
                        Number(item.quantity || 1)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="shop-total">
                Total <strong>₹{order.total}</strong>
              </div>

              <p>Payment: {order.payment}</p>
              <p className="shop-note">
                Demo order record — not proof of payment or delivery.
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
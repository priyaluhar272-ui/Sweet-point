import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);

  // 1 second ke baad loading complete karne ke liye
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const orderItems = location.state?.orderItems || [];
  const totalAmount = location.state?.totalAmount ?? 0;
  const paymentMethod = location.state?.paymentMethod || "Cash on Delivery";

  return (
    <div className="order-success-page">
      <div className="success-header">
        <h1>Scoop Aura</h1>
      </div>

      <main className="success-card">
        {/* Animated Icon Section (GPAY style loading -> green tick) */}
        <div className={`success-icon ${isLoading ? "loading" : "success"}`}>
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <svg
              viewBox="0 0 64 64"
              width="50"
              height="50"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16 32L26 42L48 20"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>

        <h2>{isLoading ? "Placing Order..." : "Order Placed Successfully!"}</h2>
        <p className="success-message">
          {isLoading
            ? "Please wait while we confirm your delicious order."
            : "Thank you for ordering with Scoop Aura. Your delicious treats are on their way!"}
        </p>

        <div className="success-divider"></div>

        <div className="success-details">
          <div>
            <span>Payment Method</span>
            <strong>{paymentMethod}</strong>
          </div>

          <div>
            <span>Total Amount</span>
            <strong>₹{Number(totalAmount).toFixed(2)}</strong>
          </div>
        </div>

        {orderItems.length > 0 && (
          <div className="success-order-items">
            <h3>Order Summary</h3>

            {orderItems.map((item, index) => (
              <div className="success-order-item" key={index}>
                <span>
                  {item.name} × {item.quantity || 1}
                </span>
                <strong>
                  ₹
                  {(
                    Number(item.price || 0) * Number(item.quantity || 1)
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        )}

        <p className="delivery-note">
          Please keep the payment ready when your order arrives.
        </p>

        <button
          className="success-home-button"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>

        <p className="success-footer-text">Made with ♡ by Scoop Aura</p>
      </main>
    </div>
  );
};

export default OrderSuccess;
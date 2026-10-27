import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";
import paymentQR from "./IMAGE/Payment_QR2.jpeg";

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cart = location.state?.cart || [];

    const [activeMethod, setActiveMethod] = useState("upi");
    const [timeLeft, setTimeLeft] = useState(300);

    const orderItems = cart;

    const itemTotal = cart.reduce(
        (total, item) =>
            total +
            Number(item.price || 0) * Number(item.quantity || 1),
        0
    );

    const deliveryCharge = 30;
    const discount = 0;

    const totalAmount =
        itemTotal + deliveryCharge - discount;

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;



    const handlePayment = async () => {
        if (orderItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            const items = orderItems.map((item) => ({
                flavour: item.flavour || item.name || "Not specified",
                item_name: item.name,
                quantity: Number(item.quantity || 1),
                total_price:
                    Number(item.price || 0) * Number(item.quantity || 1),
            }));

            const response = await fetch(
                "http://127.0.0.1:8000/orders/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ items }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.detail || "Failed to save order."
                );
            }

            // Redirect only after the database save succeeds
            navigate("/OrderSuccess", {
                state: {
                    orderItems,
                    totalAmount,
                    paymentMethod:
                        activeMethod === "cod"
                            ? "Cash on Delivery"
                            : "Card",
                },
            });
        } catch (error) {
            console.error("Order error:", error);
            alert(
                error.message ||
                "Order is not placed , Please try again."
            );
        }
    };


    return (
        <div className="payment-page">

            {/* Header */}
            <header className="payment-header">
                <div className="brand-section">
                    <div className="brand-icon">🍦</div>

                    <div>
                        <h1>Scoop Aura</h1>
                        <p>Taste the Happiness</p>
                    </div>
                </div>

                <button
                    className="back-order-btn"
                    onClick={() => navigate(-1)}
                >
                    ← <span>Back to Order</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="payment-container">

                {/* Left Side */}
                <section className="left-payment-section">

                    <div className="payment-title-card">
                        <div>
                            <h2>Complete Your Payment</h2>
                            <p>Scan the QR code or pay using any UPI app</p>
                        </div>

                        <div className="amount-box">
                            <span>Amount to Pay</span>
                            <strong>₹ {totalAmount}</strong>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="order-details-card">

                        <div className="card-heading">
                            <h3>Order Details</h3>

                            <button onClick={() => navigate(-1)}>
                                ✎ Edit
                            </button>
                        </div>

                        <div className="order-items">

                            {orderItems.map((item, index) => (
                                <div className="order-item" key={index}>

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />

                                    <div className="item-info">
                                        <h4>{item.name}</h4>
                                        <p>
                                            {item.quantity} × ₹{item.price}
                                        </p>
                                    </div>

                                    <strong>
                                        ₹{Number(item.price || 0) * Number(item.quantity || 1)}
                                    </strong>

                                </div>
                            ))}

                        </div>

                        <div className="price-details">

                            <div>
                                <span>Item Total</span>
                                <span>₹{itemTotal}</span>
                            </div>

                            <div>
                                <span>Delivery Charge</span>
                                <span>₹{deliveryCharge}</span>
                            </div>

                            <div className="discount-row">
                                <span>Discount</span>
                                <span>- ₹{discount}</span>
                            </div>

                            <div className="total-row">
                                <span>Total Amount</span>
                                <strong>₹{totalAmount}</strong>
                            </div>

                        </div>

                    </div>

                    {/* Delivery */}
                    <div className="delivery-card">
                        <div className="location-icon">📍</div>

                        <div>
                            <strong>Delivering to</strong>
                            <p>Anand, Gujarat - 388001</p>
                        </div>
                    </div>

                </section>

                {/* Right Payment Section */}
                <section className="right-payment-section">

                    {/* Payment Tabs */}

                    <div className="payment-tabs">
                        <button
                            className={activeMethod === "upi" ? "active" : ""}
                            onClick={() => setActiveMethod("upi")}
                        >
                            UPI QR
                        </button>

                        <button
                            className={activeMethod === "cod" ? "active" : ""}
                            onClick={() => setActiveMethod("cod")}
                        >
                            Pay On Delivery
                        </button>

                        <button
                            className={activeMethod === "card" ? "active" : ""}
                            onClick={() => setActiveMethod("card")}
                        >
                            Card
                        </button>
                    </div>


                    {/* UPI QR */}
                    {activeMethod === "upi" && (
                        <div className="qr-payment-box">

                            <h3>Scan QR Code to Pay</h3>

                            <div className="qr-wrapper">

                                <img
                                    src={paymentQR}
                                    alt="SweetPoint Payment QR"
                                    className="payment-qr-image"
                                />

                            </div>

                            <h4>Pay ₹{totalAmount} to SweetPoint</h4>

                            <div className="timer">
                                <span>◷</span>
                                This QR is valid for{" "}
                                <strong>
                                    {minutes}:{seconds.toString().padStart(2, "0")}
                                </strong>{" "}
                                minutes
                            </div>

                            <div className="or-section">
                                <span></span>
                                <p>OR</p>
                                <span></span>
                            </div>

                            <div className="upi-id-section">

                                <label>Pay using UPI ID</label>

                                <div className="upi-input">

                                    <span>sweetpoint@okaxis</span>

                                    <button
                                        onClick={() =>
                                            navigator.clipboard.writeText(
                                                "sweetpoint@okaxis"
                                            )
                                        }
                                    >
                                        ⧉ Copy
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* Pay On Delivery */}
                    {activeMethod === "cod" && (
                        <div className="alternative-payment">
                            <h3>Pay On Delivery</h3>

                            <div className="upi-app">
                                <div className="app-logo">₹</div>

                                <div>
                                    <strong>Cash on Delivery</strong>
                                    <p>Pay ₹{totalAmount} in cash when your order arrives.</p>
                                </div>
                            </div>


                            <button
                                className="pay-button"
                                onClick={handlePayment}
                            >
                                Confirm Order - ₹{totalAmount}
                            </button>

                        </div>
                    )}

                    {/* Card */}
                    {activeMethod === "card" && (
                        <div className="card-payment">

                            <h3>Card Payment</h3>

                            <input
                                type="text"
                                placeholder="Card Number"
                            />

                            <div className="card-row">

                                <input
                                    type="text"
                                    placeholder="MM / YY"
                                />

                                <input
                                    type="password"
                                    placeholder="CVV"
                                />

                            </div>

                            <input
                                type="text"
                                placeholder="Card Holder Name"
                            />

                            <button
                                className="pay-button"
                                onClick={handlePayment}
                            >
                                🔒 Pay ₹{totalAmount}
                            </button>

                        </div>
                    )}

                </section>

            </main>

            {/* Bottom Security Section */}
            <footer className="security-footer">

                <div className="security-item">
                    <div className="security-icon">✓</div>

                    <div>
                        <strong>Secure Payment</strong>
                        <span>256-bit encryption</span>
                    </div>
                </div>

                <div className="security-item">
                    <div className="security-icon">🔒</div>

                    <div>
                        <strong>Trusted & Reliable</strong>
                        <span>Safe & Secure</span>
                    </div>
                </div>

                <div className="security-item">
                    <div className="security-icon">✓</div>

                    <div>
                        <strong>All Major UPI Apps</strong>
                        <span>Google Pay, PhonePe, Paytm</span>
                    </div>
                </div>

            </footer>

        </div>
    );
};

export default Payment;
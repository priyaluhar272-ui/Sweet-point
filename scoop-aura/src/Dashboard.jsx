
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [bookedTables, setBookedTables] = useState([2, 5]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("18:00");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Login ke samay saved user information
    const savedUser = localStorage.getItem("scoopAuraUser");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }

    // Cart load karo
    const savedCart = localStorage.getItem("scoopAuraCart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("scoopAuraCart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          quantity: Math.max(0, Number(item.quantity || 1) + change),
        };
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const deleteItem = (id) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0
  );

  const bookTable = () => {
    if (!selectedTable || !bookingDate) {
      setMessage("Please select a table and booking date.");
      return;
    }

    if (bookedTables.includes(selectedTable)) {
      setMessage("This table is already booked in this demo.");
      return;
    }

    const booking = {
      id: Date.now(),
      table: selectedTable,
      date: bookingDate,
      time: bookingTime,
      guests,
      status: "Confirmed",
    };

    const previousBookings = JSON.parse(
      localStorage.getItem("scoopAuraBookings") || "[]"
    );

    localStorage.setItem(
      "scoopAuraBookings",
      JSON.stringify([...previousBookings, booking])
    );

    setBookedTables((previous) => [...previous, selectedTable]);
    setMessage(`Table ${selectedTable} booking saved!`);
    setSelectedTable(null);
  };

  const logout = () => {
    localStorage.removeItem("scoopAuraUser");
    navigate("/login");
  };

  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Guest";

  return (
    <div className="scoop-dashboard">
      <aside className="scoop-sidebar">
        <div className="scoop-logo">
          <span className="logo-cone">🍦</span>
          <div>
            <h2>ScoopAura</h2>
            <small>Ice Cream Shop</small>
          </div>
        </div>

        <nav className="scoop-nav">
          <button className="nav-item active" onClick={() => window.scrollTo(0, 0)}>
            🏠 Dashboard
          </button>

          <button className="nav-item" onClick={() => navigate("/flavormenu")}>
            🍨 Explore Flavors
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document.getElementById("cart-section")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            🛒 My Cart <span className="nav-count">{totalItems}</span>
          </button>

          <button
            className="nav-item"
            onClick={() =>
              document.getElementById("booking-section")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            📅 Table Booking
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/my-bookings")}
          >
            📋 My Bookings
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/order-history")}
          >
            🕘 Order History
          </button>

          <button className="nav-item logout-item" onClick={logout}>
            🚪 Logout
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-scoop">🍨</div>
          <p>Life is better with ice cream!</p>
          <span>Made with ♥</span>
        </div>
      </aside>

      <main className="scoop-main">
        <header className="scoop-topbar">
          <div className="mobile-brand">🍦 ScoopAura</div>

          {/* Name display only — profile page does not open */}
          <div className="welcome-user">
            <span className="user-avatar">♙</span>
            <span>
              Welcome, <strong>{displayName}</strong>
            </span>
          </div>
        </header>

        <section className="welcome-banner">
          <div>
            <p>Good day, {displayName}!</p>
            <h1>Welcome to ScoopAura! <span>♥</span></h1>
            <p>Your favorite ice creams, now just a click away.</p>
          </div>
          <div className="banner-emoji">🍨🍓</div>
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-card cart-card" id="cart-section">
            <div className="section-heading">
              <div>
                <h2>🛒 My Cart</h2>
                <p>Your selected ice creams</p>
              </div>
              <button
                className="text-button"
                onClick={() => navigate("/dashboard")}
              >
                Refresh
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>🍦</span>
                <h3>Your cart is empty</h3>
                <p>Explore our flavors and choose your favorite ice cream.</p>
                <button
                  className="primary-button"
                  onClick={() => navigate("/flavormenu")}
                >
                  Explore Flavors →
                </button>
              </div>
            ) : (
              <>
                <div className="cart-table-wrap">
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="cart-product">
                              {item.image ? (
                                <img src={item.image} alt={item.name} />
                              ) : (
                                <span className="product-placeholder">🍨</span>
                              )}
                              <div>
                                <strong>{item.name}</strong>
                                <small>{item.flavor || "Ice Cream"}</small>
                              </div>
                            </div>
                          </td>
                          <td>₹{Number(item.price || 0)}</td>
                          <td>
                            <div className="quantity-control">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span>{item.quantity || 1}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>
                            ₹
                            {Number(item.price || 0) *
                              Number(item.quantity || 1)}
                          </td>
                          <td>
                            <button
                              className="delete-button"
                              onClick={() => deleteItem(item.id)}
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="cart-summary">
                  <span>Total items: <strong>{totalItems}</strong></span>
                  <span>
                    Subtotal: <strong>₹{subtotal}</strong>
                  </span>
                  <span className="grand-total">
                    Grand Total: ₹{subtotal}
                  </span>
                </div>

                <div className="cart-actions">
                  <button
                    className="outline-button"
                    onClick={() => navigate("/flavormenu")}
                  >
                    ← Continue Shopping
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => {
                      if (cart.length === 0) {
                        setMessage("Your cart is empty.");
                      } else {
                        navigate("/checkout");
                      }
                    }}
                  >
                    Buy Now →
                  </button>
                </div>
              </>
            )}
          </section>

          <section
            className="dashboard-card booking-card"
            id="booking-section"
          >
            <div className="section-heading">
              <div>
                <h2>📅 Table Booking</h2>
                <p>Choose a table for your visit</p>
              </div>
            </div>

            <div className="table-grid">
              {Array.from({ length: 8 }, (_, index) => index + 1).map(
                (table) => {
                  const booked = bookedTables.includes(table);
                  const selected = selectedTable === table;

                  return (
                    <button
                      key={table}
                      disabled={booked}
                      onClick={() => {
                        setSelectedTable(table);
                        setMessage("");
                      }}
                      className={`table-option ${booked ? "booked" : ""} ${
                        selected ? "selected" : ""
                      }`}
                    >
                      <span>🪑</span>
                      <strong>Table {table}</strong>
                      <small>
                        {booked ? "Booked" : selected ? "Selected" : "Available"}
                      </small>
                    </button>
                  );
                }
              )}
            </div>

            <div className="booking-form">
              <label htmlFor="booking-date">Booking Date</label>
              <input
                id="booking-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />

              <label htmlFor="booking-time">Time</label>
              <select
                id="booking-time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              >
                <option value="12:00">12:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="20:00">8:00 PM</option>
              </select>

              <label htmlFor="guests">Number of Guests</label>
              <select
                id="guests"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
                  <option key={number} value={number}>
                    {number} {number === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>

              {message && <p className="booking-message">{message}</p>}

              <button className="primary-button full-button" onClick={bookTable}>
                📅 Book a Table
              </button>
            </div>
          </section>
        </div>

        <div className="bottom-grid">
          <section className="dashboard-card summary-card">
            <h2>🧾 Order Summary</h2>
            <p>A quick look at your cart</p>
            <div className="summary-content">
              <span className="summary-emoji">🍧</span>
              <div>
                <p>Total Items</p>
                <h2>{totalItems}</h2>
                <p>Total Amount</p>
                <h2 className="pink-text">₹{subtotal}</h2>
              </div>
            </div>
          </section>

          <section className="dashboard-card quick-card">
            <h2>✨ Quick Actions</h2>
            <p>Make your experience sweeter</p>
            <div className="quick-actions">
              <button onClick={() => navigate("/flavormenu")}>
                🍦 <span>Explore Flavors →</span>
              </button>
              <button
                onClick={() =>
                  document.getElementById("booking-section")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                🪑 <span>Book a Table →</span>
              </button>
              <button
                onClick={() =>
                  document.getElementById("cart-section")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                🛒 <span>View Cart →</span>
              </button>
              <button onClick={() => navigate("/my-bookings")}>
                📋 <span>My Bookings →</span>
              </button>
            </div>
          </section>
        </div>

        <footer className="scoop-footer">
          ♥ ScoopAura　 •　 Premium Ice Creams　 •　 Freshly Made　 •　 With Love ♥
        </footer>
      </main>
    </div>
  );
}
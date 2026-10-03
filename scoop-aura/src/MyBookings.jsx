
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopPages.css";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(
      JSON.parse(localStorage.getItem("scoopAuraBookings") || "[]")
    );
  }, []);

  const cancelBooking = (id) => {
    const updated = bookings.map((booking) =>
      booking.id === id
        ? { ...booking, status: "Cancelled" }
        : booking
    );

    setBookings(updated);
    localStorage.setItem("scoopAuraBookings", JSON.stringify(updated));
  };

  return (
    <div className="shop-page">
      <button className="shop-back" onClick={() => navigate("/dashboard")}>
        ← Dashboard
      </button>

      <div className="shop-panel">
        <h1>📅 My Bookings</h1>
        <p>View your table reservations.</p>

        {bookings.length === 0 ? (
          <div className="shop-empty">
            <span>🪑</span>
            <h2>No bookings yet</h2>
            <p>Book a table from your dashboard.</p>
            <button
              className="shop-primary"
              onClick={() => navigate("/dashboard")}
            >
              Book a Table
            </button>
          </div>
        ) : (
          bookings.map((booking) => (
            <div className="shop-booking" key={booking.id}>
              <div>
                <h3>Table {booking.table}</h3>
                <p>Date: {booking.date}</p>
                <p>Time: {booking.time}</p>
                <p>Guests: {booking.guests}</p>
                <span
                  className={
                    booking.status === "Cancelled"
                      ? "shop-status cancelled"
                      : "shop-status"
                  }
                >
                  {booking.status || "Confirmed"}
                </span>
              </div>

              {booking.status !== "Cancelled" && (
                <button
                  className="shop-cancel"
                  onClick={() => cancelBooking(booking.id)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
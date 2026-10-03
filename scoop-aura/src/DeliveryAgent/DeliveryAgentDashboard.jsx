import React, { useState } from "react";
import "./DeliveryAgentDashboard.css";

const DeliveryAgentDashboard = () => {
  const [status, setStatus] = useState("Active");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const [orders] = useState([
    {
      orderId: "#ORD001",
      customerName: "Rahul Patel",
      phoneNumber: "9876543210",
      amount: 450,
      status: "Delivered",
      orderedOn: "Sep 28, 2026 - 10:30 AM",
      assignedAt: "Sep 28, 2026 - 10:45 AM",
    },
    {
      orderId: "#ORD002",
      customerName: "Amit Shah",
      phoneNumber: "9876543211",
      amount: 620,
      status: "Out for delivery",
      orderedOn: "Sep 28, 2026 - 11:15 AM",
      assignedAt: "Sep 28, 2026 - 11:30 AM",
    },
    {
      orderId: "#ORD003",
      customerName: "Mehta",
      phoneNumber: "9876543212",
      amount: 350,
      status: "Preparing",
      orderedOn: "Sep 28, 2026 - 12:00 PM",
      assignedAt: "Sep 28, 2026 - 12:20 PM",
    },
    {
      orderId: "#ORD004",
      customerName: "denim Joshi",
      phoneNumber: "9876543213",
      amount: 780,
      status: "Cancelled",
      orderedOn: "Sep 28, 2026 - 01:10 PM",
      assignedAt: "Sep 28, 2026 - 01:25 PM",
    },
  ]);

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(search.toLowerCase()) ||
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.phoneNumber.includes(search)
  );

  const getStatusClass = (orderStatus) => {
    switch (orderStatus) {
      case "Delivered":
        return "status-delivered";

      case "Preparing":
        return "status-preparing";

      case "Out for delivery":
        return "status-out";

      default:
        return "status-cancelled";
    }
  };

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div className="header-left">

          <div className="logo-icon">
            <i className="ri-truck-line"></i>
          </div>

          <h1 className="dashboard-logo">
            SCOOP AURA 
          </h1>

        </div>


        <div className="header-right">

          {/* Notification */}

          <div className="notification-container">

            <button className="notification-button">
              <i className="ri-notification-3-line"></i>
            </button>

            <span className="notification-dot"></span>

          </div>


          {/* Status */}

          <div className="status-container">

            <button
              className={`status-button ${
                status === "Active"
                  ? "active-status"
                  : status === "Offline"
                  ? "offline-status"
                  : "inactive-status"
              }`}
              onClick={() =>
                setShowStatusMenu(!showStatusMenu)
              }
            >

              <span className="status-dot"></span>

              <span>{status}</span>

              <i className="ri-arrow-down-s-line"></i>

            </button>


            {showStatusMenu && (

              <div className="status-menu">

                <button
                  onClick={() => {
                    setStatus("Active");
                    setShowStatusMenu(false);
                  }}
                >
                  <span className="green-dot"></span>
                  Active
                </button>

                <button
                  onClick={() => {
                    setStatus("Offline");
                    setShowStatusMenu(false);
                  }}
                >
                  <span className="gray-dot"></span>
                  Offline
                </button>

                <button
                  onClick={() => {
                    setStatus("Inactive");
                    setShowStatusMenu(false);
                  }}
                >
                  <span className="red-dot"></span>
                  Inactive
                </button>

              </div>

            )}

          </div>


          {/* Profile */}

          <div className="profile-container">

            <button
              className="profile-toggle"
              onClick={() =>
                setShowProfileMenu(!showProfileMenu)
              }
            >

              <div className="profile-icon">
                <i className="ri-user-line"></i>
              </div>

              <span className="profile-name">
                Delivery Agent
              </span>

              <i className="ri-arrow-down-s-line"></i>

            </button>


            {showProfileMenu && (

              <div className="profile-menu">

                <a href="/DeliveryAgent/AgentProfile">
                  <i className="ri-user-line"></i>
                  <span>My Profile</span>
                </a>

                <div className="menu-divider"></div>

                <a
                  href="/DeliveryAgent/AgentLogin"
                  className="logout-link"
                >
                  <i className="ri-logout-box-line"></i>
                  <span>Logout</span>
                </a>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        <div className="dashboard-content">

          {/* Page Title + Search */}

          <div className="dashboard-top">

            <h2>
              Your Assigned Orders
            </h2>


            <div className="dashboard-actions">

              <div className="search-box">

                <i className="ri-search-line"></i>

                <input
                  type="text"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              <button className="filter-button">

                <i className="ri-filter-3-line"></i>

                <span>Filter</span>

              </button>

            </div>

          </div>


          {/* ================= SUMMARY CARDS ================= */}

          <div className="summary-grid">

            <div className="summary-card">

              <div>

                <p>Today's Orders</p>

                <h3>12</h3>

              </div>

              <div className="summary-icon today-icon">
                <i className="ri-shopping-bag-3-line"></i>
              </div>

            </div>


            <div className="summary-card">

              <div>

                <p>Out For Delivery</p>

                <h3>5</h3>

              </div>

              <div className="summary-icon delivery-icon">
                <i className="ri-truck-line"></i>
              </div>

            </div>


            <div className="summary-card">

              <div>

                <p>Delivered</p>

                <h3>6</h3>

              </div>

              <div className="summary-icon delivered-icon">
                <i className="ri-check-double-line"></i>
              </div>

            </div>


            <div className="summary-card">

              <div>

                <p>Cancelled</p>

                <h3>1</h3>

              </div>

              <div className="summary-icon cancelled-icon">
                <i className="ri-close-circle-line"></i>
              </div>

            </div>

          </div>


          {/* ================= ORDERS TABLE ================= */}

          <div className="orders-card">

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                      />
                    </th>

                    <th>Order ID</th>

                    <th>Customer</th>

                    <th>Amount</th>

                    <th>Status</th>

                    <th>Ordered On</th>

                    <th>Assigned At</th>

                    <th>Action</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredOrders.map((order) => (

                    <tr key={order.orderId}>

                      <td>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                        />
                      </td>


                      <td className="order-id">
                        {order.orderId}
                      </td>


                      <td>

                        <div className="customer">

                          <div className="customer-icon">
                            {order.customerName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="customer-name">
                              {order.customerName}
                            </p>

                            <p className="customer-phone">
                              {order.phoneNumber}
                            </p>

                          </div>

                        </div>

                      </td>


                      <td>
                        ₹{order.amount}
                      </td>


                      <td>

                        <span
                          className={`order-status ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </td>


                      <td>
                        {order.orderedOn}
                      </td>


                      <td>
                        {order.assignedAt}
                      </td>


                      <td>

                        <a
                          href="#"
                          className="update-status"
                        >

                          <i className="ri-edit-line"></i>

                          <span>
                            Update Status
                          </span>

                        </a>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default DeliveryAgentDashboard;
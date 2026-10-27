import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryAgentDashboard.css";

const DeliveryAgentDashboard = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Active");
  const [agent, setAgent] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [search, setSearch] = useState("");

  const API_BASE_URL = "http://127.0.0.1:8000";

  const loadAssignedOrders = useCallback(async (agentId) => {
    if (!agentId) {
      setOrders([]);
      setOrdersError("Delivery agent session nahi mila. Please dobara login karo.");
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const response = await fetch(`${API_BASE_URL}/delivery-agent/${agentId}/orders`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Orders load failed (${response.status})`);
      const rows = Array.isArray(data) ? data : data.orders;
      if (!Array.isArray(rows)) throw new Error("Assigned-orders API response is not a list.");
      setOrders(rows.map((row) => {
        const orderedDate = row.created_at || row.ordered_at;
        const assignedDate = row.assigned_at;
        const formatDateTime = (value) => value ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
        return {
          orderId: `#${row.order_id}`,
          customerName: row.customer_name || "Unknown customer",
          phoneNumber: row.customer_email || "Contact details unavailable",
          amount: Number(row.total_price || 0),
          itemName: row.item_name || row.flavour || "Ice Cream",
          quantity: Number(row.quantity || 0),
          status: row.status || "Preparing",
          orderedOn: formatDateTime(orderedDate),
          assignedAt: formatDateTime(assignedDate),
        };
      }));
    } catch (error) {
      console.error("Assigned orders API error:", error);
      setOrders([]);
      setOrdersError(error.message || "Assigned orders load nahi ho paaye.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    let savedAgent = null;
    try {
      savedAgent = JSON.parse(localStorage.getItem("deliveryAgent") || "null")
        || JSON.parse(sessionStorage.getItem("deliveryAgent") || "null");
    } catch (error) {
      console.error("Invalid delivery-agent session data:", error);
    }
    setAgent(savedAgent);
    if (savedAgent?.id) {
      setStatus(savedAgent.status || "Active");
      loadAssignedOrders(savedAgent.id);
    } else {
      setOrders([]);
      setOrdersError("Delivery agent session nahi mila. Please dobara login karo.");
      setOrdersLoading(false);
    }
  }, [loadAssignedOrders]);

  const handleLogout = async () => {
    try {
      if (agent?.id) {
        await fetch(`${API_BASE_URL}/delivery-agent/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: Number(agent.id) }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear delivery agent session data
      localStorage.removeItem("deliveryAgent");
      sessionStorage.removeItem("deliveryAgent");

      // Customer login page par redirect
      navigate("/login", { replace: true });
    }
  };
  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(search.toLowerCase()) ||
    order.customerName.toLowerCase().includes(search.toLowerCase()) ||
    order.phoneNumber.includes(search)
  );

  const todayKey = new Date().toDateString();
  const todaysOrders = orders.filter((order) => {
    if (order.orderedOn === "—") return false;
    const parsed = new Date(order.orderedOn);
    return !Number.isNaN(parsed.getTime()) && parsed.toDateString() === todayKey;
  }).length;
  const outForDeliveryCount = orders.filter((order) => order.status.toLowerCase() === "out for delivery").length;
  const deliveredCount = orders.filter((order) => order.status.toLowerCase() === "delivered").length;
  const cancelledCount = orders.filter((order) => order.status.toLowerCase() === "cancelled").length;

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
              className={`status-button ${status === "Active"
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


              <i className="ri-arrow-down-s-line"></i>

            </button>


            {showProfileMenu && (

              <div className="profile-menu">

                <a href="/DeliveryAgent/AgentProfile">
                  <i className="ri-user-line"></i>
                  <span>My Profile</span>
                </a>

                <div className="menu-divider"></div>

                <button
                  type="button"
                  className="logout-link"
                  onClick={handleLogout}
                >
                  <i className="ri-logout-box-line"></i>
                  <span>Logout</span>
                </button>
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

                <h3>{todaysOrders}</h3>

              </div>

              <div className="summary-icon today-icon">
                <i className="ri-shopping-bag-3-line"></i>
              </div>

            </div>


            <div className="summary-card">

              <div>

                <p>Out For Delivery</p>

                <h3>{outForDeliveryCount}</h3>

              </div>

              <div className="summary-icon delivery-icon">
                <i className="ri-truck-line"></i>
              </div>

            </div>


            <div className="summary-card">

              <div>

                <p>Delivered</p>

                <h3>{deliveredCount}</h3>

              </div>

              <div className="summary-icon delivered-icon">
                <i className="ri-check-double-line"></i>
              </div>

            </div>


            <div className="summary-card">

              <div>

                <p>Cancelled</p>

                <h3>{cancelledCount}</h3>

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

                  {ordersLoading && <tr><td colSpan={8}>Loading your assigned orders...</td></tr>}
                  {!ordersLoading && ordersError && <tr><td colSpan={8}>{ordersError} <button type="button" onClick={() => loadAssignedOrders(agent?.id)}>Retry</button></td></tr>}
                  {!ordersLoading && !ordersError && filteredOrders.length === 0 && <tr><td colSpan={8}>No orders have been assigned to you yet.</td></tr>}
                  {!ordersLoading && !ordersError && filteredOrders.map((order) => (

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
                            <p className="customer-phone">
                              {order.itemName} · Qty {order.quantity}
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
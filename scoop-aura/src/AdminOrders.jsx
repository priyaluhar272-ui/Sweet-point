
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [assignOrder, setAssignOrder] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("");

  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsError, setAgentsError] = useState("");

  const [message, setMessage] = useState("");

  // Fetch actual orders and customer names from PostgreSQL through FastAPI.
  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const response = await fetch(`${API_BASE_URL}/orders/admin/list`);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Orders request failed (${response.status})`);
      const rows = Array.isArray(data) ? data : data.orders;
      if (!Array.isArray(rows)) throw new Error("Orders API response is not a list.");
      setOrders(rows.map((row) => {
        const dateValue = row.created_at || row.ordered_at || null;
        const parsedDate = dateValue ? new Date(dateValue) : null;
        return {
          id: String(row.order_id),
          date: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString().slice(0, 10) : "",
          time: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—",
          name: row.item_name || row.flavour || "Ice Cream",
          flavour: row.flavour || "—",
          price: Number(row.total_price || 0) / Math.max(Number(row.quantity || 1), 1),
          quantity: Number(row.quantity || 0),
          totalPrice: Number(row.total_price || 0),
          customerName: row.customer_name || "Unknown customer",
          userId: row.user_id,
          status: row.status || "Preparing",
          deliveryAgentId: row.delivery_agent_id ?? null,
          image: "🍦",
        };
      }));
    } catch (error) {
      console.error("Orders API error:", error);
      setOrders([]);
      setOrdersError(error.message || "Orders load nahi ho paaye. Backend/API check karo.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Fetch active and online delivery agents from FastAPI
  const loadActiveAgents = useCallback(async () => {
    setAgentsLoading(true);
    setAgentsError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/delivery-agent/admin/active`
      );

      if (!response.ok) {
        throw new Error(`Unable to load agents. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data.agents)) {
        throw new Error("Invalid delivery-agent response.");
      }

      setAgents(data.agents);
    } catch (error) {
      console.error("Active delivery agents API error:", error);
      setAgents([]);
      setAgentsError(
        "Delivery agents load nahi ho paaye. Backend aur API check karo."
      );
    } finally {
      setAgentsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveAgents();
  }, [loadActiveAgents]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = `${order.id} ${order.name}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDate = !selectedDate || order.date === selectedDate;

      return matchesSearch && matchesDate;
    });
  }, [orders, search, selectedDate]);

  const totalAmount = orders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  const formatDate = (date) =>
    new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Persist the assignment in PostgreSQL; do not only remove it from React state.
  const handleAssign = async () => {
    if (!assignOrder) return setMessage("Please select an order.");
    if (agentsLoading) return setMessage("Please wait while delivery agents are loading.");
    if (agentsError) return setMessage("Delivery agents load nahi hue. Please retry.");
    if (!selectedAgent) return setMessage("Please select a delivery agent.");

    const agent = agents.find((item) => String(item.id) === String(selectedAgent));
    if (!agent) return setMessage("Selected delivery agent nahi mila. Please retry.");

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${assignOrder.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delivery_agent_id: Number(selectedAgent) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Order assignment failed.");
      setMessage(`#${assignOrder.id} assigned to ${agent.name}.`);
      setAssignOrder(null);
      setSelectedAgent("");
      await loadOrders();
    } catch (error) {
      console.error("Assign order error:", error);
      setMessage(error.message || "Order assign nahi hua. Backend endpoint check karo.");
    }
  };

  const handleReject = async (order) => {
    const confirmed = window.confirm(`Are you sure you want to reject order #${order.id}?`);
    if (!confirmed) return;
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${order.id}/reject`, { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || "Could not reject order.");
      setMessage(`#${order.id} marked as Cancelled.`);
      await loadOrders();
    } catch (error) {
      console.error("Reject order error:", error);
      setMessage(error.message || "Order reject nahi hua. Backend endpoint check karo.");
    }
  };

  const openAssignModal = (order) => {
    setAssignOrder(order);
    setSelectedAgent("");
    setMessage("");
    loadActiveAgents();
  };

  const closeAssignModal = () => {
    setAssignOrder(null);
    setSelectedAgent("");
  };

  return (
    <div className="ao-layout">
      <aside className="ao-sidebar">
        <div className="ao-brand">
          <span className="ao-brand-icon">🍦</span>
          <span>
            Scoop <b>Aura</b>
          </span>
        </div>

        <nav className="ao-nav">
          <button onClick={() => navigate("/admin/dashboard")}>
            <span>⌂</span> Dashboard
          </button>

          <button onClick={() => navigate("/admin/customers")}>
            <span>♧</span> Customers
          </button>

          <button className="ao-nav-active">
            <span>▣</span> Orders
          </button>

          <button onClick={() => navigate("/admin/delivery-agents")}>
            <span>♧</span> Delivery Agents
          </button>

          <button onClick={() => navigate("/admin/products")}>
            <span>▤</span> Products
          </button>

          <button onClick={() => navigate("/admin/offers")}>
            <span>◇</span> Offers
          </button>

          <button onClick={() => navigate("/admin/analytics")}>
            <span>▥</span> Analytics
          </button>

          <button onClick={() => navigate("/admin/settings")}>
            <span>⚙</span> Settings
          </button>
        </nav>
      </aside>

      <main className="ao-main">
        <section className="ao-content">
          <div className="ao-breadcrumb"></div>

          <div className="ao-title-row ao-title-centered">
            <div className="ao-title-icon">♧</div>
            <div>
              <h1>Orders</h1>
              <p>
                View real customer orders and assign them to delivery agents.
              </p>
            </div>
          </div>

          {message && (
            <div className="ao-message" role="status">
              <span>{message}</span>
              <button
                type="button"
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          <div className="ao-summary">
            <article className="ao-summary-card">
              <div className="ao-summary-icon pink">▣</div>
              <div>
                <p>Total Orders</p>
                <h2>{orders.length}</h2>
              </div>
            </article>

            <article className="ao-summary-card">
              <div className="ao-summary-icon green">₹</div>
              <div>
                <p>Total Order Value</p>
                <h2>₹{totalAmount.toLocaleString("en-IN")}</h2>
              </div>
            </article>
          </div>

          <section className="ao-table-card">
            <div className="ao-toolbar">
              <div className="ao-search">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Search by order ID or item name..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <label className="ao-date-filter">
                <span>▦</span>
                <input
                  type="date"
                  aria-label="Filter orders by date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />

                {selectedDate && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate("")}
                    aria-label="Clear date filter"
                  >
                    ×
                  </button>
                )}
              </label>
            </div>

            <div className="ao-table-wrap">
              <table className="ao-table ao-updated-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>ITEM NAME</th>
                    <th>PRICE</th>
                    <th>QUANTITY</th>
                    <th>TOTAL PRICE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {ordersLoading && <tr><td colSpan={6} className="ao-empty">Loading orders from database...</td></tr>}
                  {!ordersLoading && ordersError && <tr><td colSpan={6} className="ao-empty">{ordersError} <button type="button" onClick={loadOrders}>Retry</button></td></tr>}
                  {!ordersLoading && !ordersError && filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="ao-order-id">
                        <strong>#{order.id}</strong>
                        <small>
                          {order.date ? `${formatDate(order.date)}, ${order.time}` : "Date not available"}
                        </small>
                      </td>

                      <td>
                        <div className="ao-product-cell">
                          <div className="ao-product-image">
                            {order.image || "🍦"}
                          </div>
                          <span className="ao-item-name">{order.name}</span>
                        </div>
                      </td>

                      <td>₹{Number(order.price || 0).toLocaleString("en-IN")}</td>

                      <td>{order.quantity}</td>

                      <td className="ao-total">
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </td>

                      <td>
                        <div className="ao-actions">
                          <button
                            type="button"
                            className="ao-assign-btn"
                            onClick={() => openAssignModal(order)}
                          >
                            Assign
                          </button>

                          <button
                            type="button"
                            className="ao-reject-btn"
                            onClick={() => handleReject(order)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="ao-empty">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="ao-table-footer">
              Showing {filteredOrders.length} of {orders.length} orders
            </footer>
          </section>
        </section>
      </main>

      {assignOrder && (
        <div
          className="ao-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAssignModal();
            }
          }}
        >
          <section
            className="ao-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ao-modal-title"
          >
            <button
              type="button"
              className="ao-modal-close"
              onClick={closeAssignModal}
              aria-label="Close"
            >
              ×
            </button>

            <div className="ao-modal-icon">🛵</div>

            <h2 id="ao-modal-title">Assign Delivery Agent</h2>

            <p>
              Select an agent for order <strong>#{assignOrder.id}</strong>.
            </p>

            <label className="ao-agent-label" htmlFor="ao-agent-select">
              Delivery Agent
            </label>

            <select
              id="ao-agent-select"
              value={selectedAgent}
              onChange={(event) => setSelectedAgent(event.target.value)}
              disabled={agentsLoading || Boolean(agentsError)}
            >
              <option value="">
                {agentsLoading
                  ? "Loading delivery agents..."
                  : agentsError
                    ? "Unable to load agents"
                    : agents.length === 0
                      ? "No active online agents"
                      : "Select delivery agent"}
              </option>

              {agents.map((agent) => (
                <option key={agent.id} value={String(agent.id)}>
                  {agent.name}
                  {agent.contact_number
                    ? ` — ${agent.contact_number}`
                    : ""}
                </option>
              ))}
            </select>

            {agentsLoading && (
              <p className="ao-agent-hint" role="status">
                Please wait, fetching delivery agents...
              </p>
            )}

            {agentsError && (
              <div className="ao-agent-error" role="alert">
                <p>{agentsError}</p>
                <button
                  type="button"
                  onClick={loadActiveAgents}
                  disabled={agentsLoading}
                >
                  Retry
                </button>
              </div>
            )}

            {!agentsLoading && !agentsError && agents.length === 0 && (
              <p className="ao-agent-hint">
                Koi Active aur Online delivery agent available nahi hai.
                Agent ka status database mein Active hona chahiye aur agent
                logged in hona chahiye.
              </p>
            )}

            <div className="ao-modal-actions">
              <button
                type="button"
                className="ao-cancel-btn"
                onClick={closeAssignModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ao-confirm-btn"
                onClick={handleAssign}
                disabled={
                  agentsLoading ||
                  Boolean(agentsError) ||
                  agents.length === 0 ||
                  !selectedAgent
                }
              >
                Confirm Assignment
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
  

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageCustomers.css";

const API_URL = "http://127.0.0.1:8000/admin/customers";

function ManageCustomers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("table");
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = 8;

  // Fetch real customer data from FastAPI
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || `Request failed: ${response.status}`
        );
      }

      if (!Array.isArray(data.customers)) {
        throw new Error(
          "Invalid API response: customers array not found."
        );
      }

      const formattedCustomers = data.customers.map((customer) => ({
        id: customer.id,
        name: customer.name || "Unnamed Customer",
        email: customer.email || "—",
        orders: Number(customer.orders ?? 0),
        spent: Number(customer.spent ?? 0),
        joined: customer.joined || "—",
        status: customer.status || "Registered",
      }));

      setCustomers(formattedCustomers);
    } catch (err) {
      console.error("Customer API error:", err);
      setError(
        err.message ||
          "Unable to load customers. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Search and status filtering
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch = [
        customer.name,
        customer.email,
      ].some((value) =>
        String(value).toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / pageSize)
  );

  const visibleCustomers = filteredCustomers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const updateSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const money = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);

  const totalOrders = customers.reduce(
    (sum, customer) => sum + customer.orders,
    0
  );

  const totalSpent = customers.reduce(
    (sum, customer) => sum + customer.spent,
    0
  );

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/login", { replace: true });
  };

  return (
    <div className="mc-page">
      {/* Sidebar */}
      <aside className="mc-sidebar">
        <div className="mc-brand">
          <span className="mc-brand-icon">🍦</span>
          <div>
            <h2>Scoop Aura</h2>
            <p>Taste the Happiness</p>
          </div>
        </div>

        <nav className="mc-navigation">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
          >
            <span>⌂</span> Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/items")}
          >
            <span>▣</span> Manage Items
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/flavours")}
          >
            <span>🍦</span> Manage Flavours
          </button>

          <button type="button" className="active">
            <span>♟</span> Customers
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/delivery-agents")}
          >
            <span>🛵</span> Delivery Agents
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
          >
            <span>▤</span> Orders
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/revenue")}
          >
            <span>▥</span> Total Revenue
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/reports")}
          >
            <span>◔</span> Reports
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/settings")}
          >
            <span>⚙</span> Settings
          </button>
        </nav>

        <div className="mc-sidebar-promo">
          <span>🍓</span>
          <h3>Sweet Moments</h3>
          <h3>Happy People</h3>
          <div>🍦</div>
          <p>Scoop Aura ♥</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="mc-main">
        <header className="mc-topbar">
          <div className="mc-breadcrumb">
            <span className="mc-mobile-brand">
              🍦 Scoop Aura
            </span>
            <span>Admin Panel / Customers</span>
          </div>

          <div className="mc-top-actions">
            <label className="mc-top-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search customers..."
                value={search}
                onChange={(event) =>
                  updateSearch(event.target.value)
                }
              />
            </label>

            <span className="mc-bell">♧</span>

            <div className="mc-admin-profile">
              <span>👤</span>
              <div>
                <strong>Admin</strong>
                <small>Scoop Aura</small>
              </div>
            </div>

            <button
              type="button"
              className="mc-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="mc-content">
          {/* Page heading */}
          <section className="mc-hero">
            <div className="mc-hero-icon">👥</div>

            <div className="mc-hero-copy">
              <p>CUSTOMER MANAGEMENT</p>
              <h1>Customers</h1>
              <span>
                View registered customers and their order activity.
              </span>
            </div>

            <div className="mc-hero-art">🍓 🍨 🍦</div>
          </section>

          {/* Summary cards */}
          <section className="mc-summary">
            <article>
              <span className="mc-summary-icon">👥</span>
              <div>
                <p>Total Customers</p>
                <h2>{customers.length}</h2>
              </div>
            </article>

            <article>
              <span className="mc-summary-icon">🛍️</span>
              <div>
                <p>Total Orders</p>
                <h2>{totalOrders}</h2>
              </div>
            </article>

            <article>
              <span className="mc-summary-icon">₹</span>
              <div>
                <p>Total Customer Spend</p>
                <h2>{money(totalSpent)}</h2>
              </div>
            </article>
          </section>

          {/* Customer directory */}
          <section className="mc-panel">
            <div className="mc-panel-heading">
              <div>
                <h2>Customer Directory</h2>
                <p>
                  Customer details fetched from your database.
                </p>
              </div>

              <div className="mc-view-toggle">
                <button
                  type="button"
                  className={view === "table" ? "active" : ""}
                  onClick={() => setView("table")}
                >
                  ☷ Table View
                </button>

                <button
                  type="button"
                  className={view === "grid" ? "active" : ""}
                  onClick={() => setView("grid")}
                >
                  ▦ Grid View
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mc-filters">
              <label className="mc-filter-search">
                <span>⌕</span>
                <input
                  type="search"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(event) =>
                    updateSearch(event.target.value)
                  }
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
              >
                <option value="All">All Status</option>
                <option value="Registered">Registered</option>
              </select>

              <button
                type="button"
                className="mc-reset"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPage(1);
                }}
              >
                ↻ Reset
              </button>

              <button
                type="button"
                className="mc-reset"
                onClick={fetchCustomers}
                disabled={loading}
              >
                ↻ {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {loading && (
              <div className="mc-empty">
                Loading customers from database...
              </div>
            )}

            {!loading && error && (
              <div className="mc-empty" role="alert">
                <p>{error}</p>
                <button
                  type="button"
                  className="mc-reset"
                  onClick={fetchCustomers}
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {view === "table" ? (
                  <div className="mc-table-wrap">
                    <table className="mc-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Total Orders</th>
                          <th>Total Spent</th>
                          <th>Joined On</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {visibleCustomers.map((customer, index) => (
                          <tr key={customer.id}>
                            <td>
                              {(page - 1) * pageSize + index + 1}
                            </td>

                            <td className="mc-customer-name">
                              {customer.name}
                            </td>

                            <td>{customer.email}</td>
                            <td>{customer.orders}</td>
                            <td>{money(customer.spent)}</td>
                            <td>{customer.joined}</td>

                            <td>
                              <span className="mc-status registered">
                                {customer.status}
                              </span>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="mc-view-button"
                                title="View customer"
                                onClick={() =>
                                  setSelectedCustomer(customer)
                                }
                              >
                                ◉
                              </button>
                            </td>
                          </tr>
                        ))}

                        {visibleCustomers.length === 0 && (
                          <tr>
                            <td colSpan="8" className="mc-empty">
                              No matching customers found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="mc-customer-grid">
                    {visibleCustomers.map((customer) => (
                      <article
                        className="mc-customer-card"
                        key={customer.id}
                      >
                        <div className="mc-card-top">
                          <span className="mc-card-avatar">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>

                          <span className="mc-status registered">
                            {customer.status}
                          </span>
                        </div>

                        <h3>{customer.name}</h3>
                        <p className="mc-card-email">
                          {customer.email}
                        </p>

                        <div className="mc-card-stats">
                          <span>{customer.orders} Orders</span>
                          <strong>{money(customer.spent)} Spent</strong>
                        </div>

                        <p>Joined: {customer.joined}</p>

                        <button
                          type="button"
                          className="mc-details-button"
                          onClick={() =>
                            setSelectedCustomer(customer)
                          }
                        >
                          View Details →
                        </button>
                      </article>
                    ))}

                    {visibleCustomers.length === 0 && (
                      <p className="mc-empty">
                        No matching customers found.
                      </p>
                    )}
                  </div>
                )}

                <div className="mc-pagination">
                  <span>
                    Showing{" "}
                    {filteredCustomers.length === 0
                      ? 0
                      : (page - 1) * pageSize + 1}
                    {"–"}
                    {Math.min(
                      page * pageSize,
                      filteredCustomers.length
                    )}{" "}
                    of {filteredCustomers.length} customers
                  </span>

                  <div>
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() =>
                        setPage((previous) => previous - 1)
                      }
                    >
                      ‹
                    </button>

                    <span>
                      {page} / {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((previous) => previous + 1)
                      }
                    >
                      ›
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>

          <footer className="mc-footer">
            © {new Date().getFullYear()} Scoop Aura · Taste the Happiness 🍨
          </footer>
        </main>
      </div>

      {/* Customer details modal */}
      {selectedCustomer && (
        <div
          className="mc-modal-backdrop"
          onClick={() => setSelectedCustomer(null)}
        >
          <section
            className="mc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mc-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="mc-modal-close"
              onClick={() => setSelectedCustomer(null)}
              aria-label="Close customer details"
            >
              ×
            </button>

            <span className="mc-modal-avatar">
              {selectedCustomer.name.charAt(0).toUpperCase()}
            </span>

            <h2 id="mc-modal-title">
              {selectedCustomer.name}
            </h2>

            <span className="mc-status registered">
              {selectedCustomer.status}
            </span>

            <div className="mc-detail-list">
              <p>
                <strong>Email:</strong> {selectedCustomer.email}
              </p>
              <p>
                <strong>Joined:</strong> {selectedCustomer.joined}
              </p>
              <p>
                <strong>Total Orders:</strong> {selectedCustomer.orders}
              </p>
              <p>
                <strong>Total Spent:</strong> {money(selectedCustomer.spent)}
              </p>
            </div>

            <button
              type="button"
              className="mc-details-button"
              onClick={() => setSelectedCustomer(null)}
            >
              Close
            </button>
          </section>
        </div>
      )}
    </div>
  );
}

export default ManageCustomers;

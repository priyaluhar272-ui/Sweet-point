
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import React, { useEffect, useState } from "react";


const menuItems = [
  { label: "Dashboard", icon: "⌂", route: "/admin/dashboard" },
  { label: "Manage Items", icon: "🍧", route: "/admin/items" },
  { label: "Manage Flavours", icon: "🍦", route: "/admin/flavours" },
  { label: "Customers", icon: "♟", route: "/admin/customers" },
  { label: "Delivery Agents", icon: "🛵", route: "/admin/delivery-agents" },
  { label: "Orders", icon: "▤", route: "/admin/orders" },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [search, setSearch] = useState("");

  const [statsData, setStatsData] = useState({
  totalItems: null,
  totalFlavours: null,
  totalCustomers: null,
  totalDeliveryAgents: null,
});

const [statsLoading, setStatsLoading] = useState(true);
const [statsError, setStatsError] = useState("");

useEffect(() => {
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setStatsError("");

      const response = await fetch(
        "http://127.0.0.1:8000/admin/dashboard/stats"
      );

      if (!response.ok) {
        throw new Error("Dashboard statistics load nahi hui.");
      }

      const data = await response.json();

      setStatsData({
        totalItems: data.total_items ?? null,
        totalFlavours: data.total_flavours ?? null,
        totalCustomers: data.total_customers,
        totalDeliveryAgents: data.total_delivery_agents,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
      setStatsError(error.message);
    } finally {
      setStatsLoading(false);
    }
  };

  fetchStats();
}, []);

  const handleMenu = (item) => {
    if (item.route) {
      navigate(item.route);
    } else {
      setActiveMenu(item.label);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/login", { replace: true });
  };

const stats = [
  {
    label: "Total Items",
    value: statsLoading
      ? "..."
      : statsError
        ? "—"
        : statsData.totalItems ?? "—",
    icon: "🍨",
    change: "Menu items",
    color: "pink",
  },
  {
    label: "Total Flavours",
    value: statsLoading
      ? "..."
      : statsError
        ? "—"
        : statsData.totalFlavours ?? "—",
    icon: "🍦",
    change: "Available flavours",
    color: "purple",
  },
  {
    label: "Total Customers",
    value: statsLoading
      ? "..."
      : statsError
        ? "—"
        : statsData.totalCustomers ?? "—",
    icon: "♟",
    change: "Registered customers",
    color: "rose",
  },
  {
    label: "Delivery Agents",
    value: statsLoading
      ? "..."
      : statsError
        ? "—"
        : statsData.totalDeliveryAgents ?? "—",
    icon: "🛵",
    change: "Registered agents",
    color: "orange",
  },
  {
    label: "Total Revenue",
    value: "₹24,850",
    icon: "₹",
    change: "Demo revenue",
    color: "pink",
  },
];

  const quickActions = [
    { label: "Manage Items", icon: "🍧", description: "Manage products", route: "/admin/items" },
    { label: "Manage Flavours", icon: "🍦", description: "Edit flavours", route: "/admin/flavours" },
    { label: "Customers", icon: "👥", description: "View customers", route: "/admin/customers" },
    { label: "Delivery Agents", icon: "🛵", description: "Manage agents", route: "/admin/delivery-agents" },
    { label: "Orders", icon: "📦", description: "Track orders", route: "/admin/orders" },
  ];

  const orders = [
    { id: "#SA1001", customer: "Priya Shah", item: "Chocolate Sundae", amount: "₹250", status: "Delivered" },
    { id: "#SA1002", customer: "Rohan Patel", item: "Strawberry Scoop", amount: "₹180", status: "Preparing" },
    { id: "#SA1003", customer: "Neha Mehta", item: "Mango Delight", amount: "₹320", status: "Out for delivery" },
    { id: "#SA1004", customer: "Dev Patel", item: "Vanilla Cone", amount: "₹120", status: "Pending" },
  ];

  const visibleOrders = orders.filter((order) =>
    `${order.id} ${order.customer} ${order.item}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="sa-admin">
      <aside className="sa-sidebar">
        <div className="sa-brand">
          <span className="sa-brand-icon">🍦</span>
          <div>
            <h2>Scoop Aura</h2>
            <p>Taste the Happiness</p>
          </div>
        </div>

        <nav className="sa-navigation">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sa-nav-item ${activeMenu === item.label ? "active" : ""}`}
              onClick={() => handleMenu(item)}
            >
              <span className="sa-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sa-sidebar-promo">
          <span>🍓</span>
          <h3>Sweet Moments</h3>
          <h3>Happy People</h3>
          <div className="sa-promo-cone">🍦</div>
          <p>Made with love ♥</p>
        </div>
      </aside>

      <div className="sa-main">
        <header className="sa-topbar">
          <div className="sa-top-left">
            <span className="sa-mobile-brand">🍦 Scoop Aura</span>
            <span className="sa-top-label">Admin Panel / Dashboard</span>
          </div>

          <div className="sa-top-actions">
            <label className="sa-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search recent orders..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <button type="button" className="sa-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="sa-content">
          <section className="sa-welcome">
            <div className="sa-welcome-copy">
              <p className="sa-eyebrow">ADMIN OVERVIEW</p>
              <h1>Welcome to Admin Dashboard! 🍦</h1>
              <p>Manage your Scoop Aura store, customers and daily operations from one place.</p>
            </div>
            <div className="sa-welcome-art">🍓 🍨 🍦</div>
          </section>

          <section className="sa-stats">
            {stats.map((stat) => (
              <article className="sa-stat-card" key={stat.label}>
                <div className={`sa-stat-icon ${stat.color}`}>{stat.icon}</div>
                <div className="sa-stat-info">
                  <p>{stat.label}</p>
                  <h2>{stat.value}</h2>
                  <span className="sa-stat-change">{stat.change}</span>
                </div>
              </article>
            ))}
          </section>

          <section className="sa-quick-layout">
            <div className="sa-panel">
              <div className="sa-section-heading">
                <h2>Quick Actions</h2>
                <span>Manage your store</span>
              </div>

              <div className="sa-quick-actions">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="sa-quick-card"
                    onClick={() => navigate(action.route)}
                  >
                    <span>{action.icon}</span>
                    <strong>{action.label}</strong>
                    <small>{action.description}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="sa-special-card">
              <div>
                <span className="sa-special-heart">♥ Sweet Treats</span>
                <h2>Make Every Scoop Special!</h2>
                <p>Keep your menu fresh and give customers a delightful experience.</p>
                <button type="button" onClick={() => navigate("/admin/flavours")}>
                  Manage Flavours →
                </button>
              </div>
              <span className="sa-special-icecream">🍨</span>
            </div>
          </section>

          <footer className="sa-footer">
            © {new Date().getFullYear()} Scoop Aura · Taste the Happiness 🍨
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

import React, { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

const initialForm = {
  item_name: "",
  description: "",
  price: "",
  flavour_id: "",
  is_available: true,
};

const styles = {
  page: {
    padding: "28px",
    background: "#fff8fb",
    minHeight: "100vh",
    color: "#352333",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  title: { margin: 0, fontSize: "28px" },
  muted: { color: "#887786", marginTop: "8px" },
  button: {
    background: "#e83e8c",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: 600,
  },
  card: {
    background: "#fff",
    border: "1px solid #f3dce8",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "22px",
    boxShadow: "0 4px 16px rgba(80, 30, 60, 0.04)",
  },
  input: {
    padding: "11px 12px",
    border: "1px solid #e6d4df",
    borderRadius: "8px",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "14px",
    background: "#fff",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "7px",
  },
  smallButton: {
    border: "1px solid #ead4e0",
    borderRadius: "7px",
    padding: "8px 10px",
    cursor: "pointer",
    background: "#fff",
    color: "#8c285b",
    marginRight: "6px",
  },
};

export default function ManageItems() {
  const [items, setItems] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [itemsResponse, flavoursResponse] = await Promise.all([
        fetch(`${API_URL}/items/`),
        fetch(`${API_URL}/items/flavours`),
      ]);

      const itemsData = await itemsResponse.json();
      const flavoursData = await flavoursResponse.json();

      if (!itemsResponse.ok) {
        throw new Error(itemsData.detail || "Items load nahi ho paaye.");
      }

      if (!flavoursResponse.ok) {
        throw new Error(
          flavoursData.detail || "Flavours load nahi ho paaye."
        );
      }

      setItems(itemsData);
      setFlavours(flavoursData);
    } catch (err) {
      setError(
        `${err.message} Backend running hai aur API routes registered hain, ye check karo.`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setMessage("");
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setForm({
      item_name: item.item_name || "",
      description: item.description || "",
      price: String(item.price ?? ""),
      flavour_id: item.flavour_id ? String(item.flavour_id) : "",
      is_available: Boolean(item.is_available),
    });
    setError("");
    setMessage("");
    setModalOpen(true);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveItem(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      item_name: form.item_name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      flavour_id: form.flavour_id ? Number(form.flavour_id) : null,
      is_available: form.is_available,
    };

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/items/${editingId}`
          : `${API_URL}/items/`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Item save nahi hua.");
      }

      setModalOpen(false);
      setMessage(editingId ? "Item successfully updated." : "Item successfully added.");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item) {
    const confirmed = window.confirm(
      `"${item.item_name}" ko permanently delete karna hai?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/items/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Item delete nahi hua.");
      }

      setItems((previous) => previous.filter((x) => x.id !== item.id));
      setMessage("Item successfully deleted.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleAvailability(item) {
    try {
      const response = await fetch(`${API_URL}/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_name: item.item_name,
          description: item.description || "",
          price: Number(item.price),
          flavour_id: item.flavour_id ?? null,
          is_available: !item.is_available,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Status update nahi hua.");
      }

      await loadData();
      setMessage("Availability status updated.");
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredItems = items.filter((item) => {
    const text = `${item.item_name} ${item.flavour_name || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const availableCount = items.filter((item) => item.is_available).length;

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Manage Items</h1>
          <p style={styles.muted}>
            Scoop Aura · Manage your products and flavours
          </p>
        </div>

        <button style={styles.button} onClick={openAddModal}>
          + Add New Item
        </button>
      </div>

      {error && (
        <div role="alert" style={{
          ...styles.card, color: "#a51d35", background: "#fff0f2",
          borderColor: "#f3b9c4",
        }}>
          {error}
        </div>
      )}

      {message && (
        <div role="status" style={{
          ...styles.card, color: "#216b45", background: "#effaf3",
          borderColor: "#b9e8c8",
        }}>
          {message}
        </div>
      )}

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "22px",
      }}>
        {[
          { label: "Total Items", value: items.length },
          { label: "Available Items", value: availableCount },
          { label: "Total Flavours", value: flavours.length },
        ].map((stat) => (
          <div key={stat.label} style={styles.card}>
            <p style={styles.muted}>{stat.label}</p>
            <h2 style={{ fontSize: "30px", margin: "8px 0 0", color: "#d82f80" }}>
              {stat.value}
            </h2>
          </div>
        ))}
      </section>

      <section style={styles.card}>
        <label style={styles.label} htmlFor="item-search">
          Search items
        </label>
        <input
          id="item-search"
          style={{ ...styles.input, maxWidth: "420px" }}
          placeholder="Search by item or flavour..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <section style={{ ...styles.card, overflowX: "auto" }}>
        <h2 style={{ fontSize: "19px", marginTop: 0 }}>Items List</h2>

        {loading ? (
          <p>Loading items from PostgreSQL...</p>
        ) : filteredItems.length === 0 ? (
          <p style={styles.muted}>
            {items.length === 0
              ? "Abhi koi item nahi hai. Add New Item par click karke pehla item add karo."
              : "Search ke liye koi matching item nahi mila."}
          </p>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "760px",
            textAlign: "left",
          }}>
            <thead>
              <tr style={{ background: "#fff1f7" }}>
                {["ID", "Item Name", "Flavour", "Price", "Status", "Actions"].map((heading) => (
                  <th key={heading} style={{
                    padding: "13px 10px",
                    borderBottom: "1px solid #f1dce7",
                    fontSize: "13px",
                  }}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: "14px 10px", borderBottom: "1px solid #f4e8ef" }}>
                    {item.id}
                  </td>
                  <td style={{ padding: "14px 10px", borderBottom: "1px solid #f4e8ef" }}>
                    <strong>{item.item_name}</strong>
                    {item.description && (
                      <div style={{ ...styles.muted, fontSize: "12px" }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "14px 10px", borderBottom: "1px solid #f4e8ef" }}>
                    {item.flavour_name || "Not assigned"}
                  </td>
                  <td style={{ padding: "14px 10px", borderBottom: "1px solid #f4e8ef" }}>
                    ₹{Number(item.price).toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 10px", borderBottom: "1px solid #f4e8ef" }}>
                    <button
                      onClick={() => toggleAvailability(item)}
                      style={{
                        ...styles.smallButton,
                        color: item.is_available ? "#197548" : "#a12d3a",
                      }}
                    >
                      {item.is_available ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td style={{ padding: "14px 10px", borderBottom: "1px solid #f4e8ef" }}>
                    <button style={styles.smallButton} onClick={() => openEditModal(item)}>
                      Edit
                    </button>
                    <button
                      style={{ ...styles.smallButton, color: "#b42335" }}
                      onClick={() => deleteItem(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(35, 15, 28, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <form
            onSubmit={saveItem}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "25px",
              width: "100%",
              maxWidth: "520px",
              boxSizing: "border-box",
              margin: "auto",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {editingId ? "Edit Item" : "Add New Item"}
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label style={styles.label}>Item Name *</label>
              <input
                required
                maxLength={150}
                name="item_name"
                value={form.item_name}
                onChange={updateField}
                style={styles.input}
                placeholder="e.g. Chocolate Sundae"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                style={{ ...styles.input, minHeight: "85px", resize: "vertical" }}
                placeholder="Describe this item..."
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={styles.label}>Price (₹) *</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={form.price}
                onChange={updateField}
                style={styles.input}
                placeholder="e.g. 120"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={styles.label}>Flavour</label>
              <select
                name="flavour_id"
                value={form.flavour_id}
                onChange={updateField}
                style={styles.input}
              >
                <option value="">No flavour assigned</option>
                {flavours.map((flavour) => (
                  <option key={flavour.id} value={flavour.id}>
                    {flavour.flavour_name}
                  </option>
                ))}
              </select>
              {flavours.length === 0 && (
                <p style={{ ...styles.muted, fontSize: "12px" }}>
                  Pehle Manage Flavours se flavours add karo.
                </p>
              )}
            </div>

            <label style={{
              display: "flex", alignItems: "center", gap: "9px",
              marginBottom: "22px", fontSize: "14px",
            }}>
              <input
                type="checkbox"
                name="is_available"
                checked={form.is_available}
                onChange={updateField}
              />
              Item is available for ordering
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                style={{ ...styles.smallButton, padding: "12px 16px" }}
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" style={styles.button} disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Item" : "Save Item"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

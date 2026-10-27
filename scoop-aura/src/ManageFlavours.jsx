
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ManageFlavours.css";


// Load existing flavour images from the same folder as FlavorMenu.jsx
const imageModules = import.meta.glob(
  "./falvoricecream/*",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const normalize = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const imageFiles = Object.entries(imageModules).map(([path, image]) => ({
  image,
  filename: path.split("/").pop().split(".")[0],
  normalized: normalize(path.split("/").pop().split(".")[0]),
}));

const getFlavorImage = (flavorName) => {
  const searchName = normalize(flavorName);

  const match = imageFiles.find(
    (file) =>
      file.normalized.includes(searchName) ||
      searchName.includes(file.normalized)
  );

  return match?.image || null;
};

const initialFlavours = [
  { id: 1, name: "Chocolate", emoji: "🍫", color: "#f5dfd1" },
  { id: 2, name: "Strawberry", emoji: "🍓", color: "#ffe0e9" },
  { id: 3, name: "Vanilla", emoji: "🍨", color: "#fff0c9" },
  { id: 4, name: "Butterscotch", emoji: "🍮", color: "#ffe3bb" },
  { id: 5, name: "Mango", emoji: "🥭", color: "#ffe7a5" },
  { id: 6, name: "Mint Chocolate", emoji: "🍃", color: "#d9f2df" },
  { id: 7, name: "Blueberry", emoji: "🫐", color: "#e9e0ff" },
  { id: 8, name: "Cookies & Cream", emoji: "🍪", color: "#eee4d8" },
  { id: 9, name: "Pistachio", emoji: "💚", color: "#e5efc9" },
  { id: 10, name: "Coffee", emoji: "☕", color: "#ead5c4" },
  { id: 11, name: "Raspberry", emoji: "🍧", color: "#ffdce5" },
  { id: 12, name: "Kulfi", emoji: "🍦", color: "#fff0dc" },
].map((flavour) => ({
  ...flavour,
  image: getFlavorImage(flavour.name),
}));

function ManageFlavours() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [flavours, setFlavours] = useState(initialFlavours);
  const [activeMode, setActiveMode] = useState("view");
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [flavourName, setFlavourName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const filteredFlavours = flavours.filter((flavour) =>
    flavour.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const toggleSelection = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredFlavours.map((flavour) => flavour.id);
    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) => selectedIds.includes(id));

    setSelectedIds((previous) =>
      allSelected
        ? previous.filter((id) => !visibleIds.includes(id))
        : [...new Set([...previous, ...visibleIds])]
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select an image file.", "error");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage("Image size must be 2 MB or less.", "error");
      event.target.value = "";
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setMessage("");
  };

  const resetForm = () => {
    setFlavourName("");
    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddFlavour = (event) => {
    event.preventDefault();

    const name = flavourName.trim();

    if (!name) {
      showMessage("Please enter a flavour name.", "error");
      return;
    }

    if (flavours.some(
      (flavour) => flavour.name.toLowerCase() === name.toLowerCase()
    )) {
      showMessage("This flavour already exists.", "error");
      return;
    }

    if (!imageFile || !imagePreview) {
      showMessage("Please upload a flavour image.", "error");
      return;
    }

    const newFlavour = {
      id: Date.now(),
      name,
      image: imagePreview,
      emoji: "🍦",
      color: "#ffe5ef",
    };

    setFlavours((previous) => [newFlavour, ...previous]);
    setSearch("");
    resetForm();
    setActiveMode("view");
    showMessage(`${name} flavour added successfully!`);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      showMessage("Please select at least one flavour to remove.", "error");
      return;
    }

    const count = selectedIds.length;

    const confirmed = window.confirm(
      `Remove ${count} selected flavour${count > 1 ? "s" : ""}?`
    );

    if (!confirmed) return;

    setFlavours((previous) =>
      previous.filter((flavour) => !selectedIds.includes(flavour.id))
    );

    setSelectedIds([]);
    setActiveMode("view");
    showMessage(`${count} flavour${count > 1 ? "s" : ""} removed.`);
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setMessage("");

    if (mode !== "remove") {
      setSelectedIds([]);
    }

    if (mode !== "add") {
      resetForm();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/login", { replace: true });
  };

  return (
    <div className="mf-page">
      <aside className="mf-sidebar">
        <div className="mf-brand">
          <span className="mf-brand-icon">🍦</span>
          <div>
            <h2>Scoop Aura</h2>
            <p>Taste the Happiness</p>
          </div>
        </div>

// ManageFlavours.jsx ke sidebar navigation section ko is tarah update karein:
        <nav className="mf-nav">
          <button onClick={() => navigate("/admin/dashboard")}>
            <span>⌂</span> Dashboard
          </button>
          <button onClick={() => navigate("/admin/items")}>
            <span>▣</span> Manage Items
          </button>
          <button className="active" onClick={() => navigate("/admin/flavours")}>
            <span>🍦</span> Manage Flavours
          </button>
          <button onClick={() => navigate("/admin/customers")}>
            <span>♟</span> Customers
          </button>
          <button onClick={() => navigate("/admin/delivery-agents")}>
            <span>🛵</span> Delivery Agents
          </button>
          <button onClick={() => navigate("/admin/orders")}>
            <span>▤</span> Orders
          </button>
        </nav>

        <div className="mf-sidebar-art">
          <span>🍓</span>
          <h3>Sweet Moments</h3>
          <h3>Happy People</h3>
          <div>🍦</div>
        </div>
      </aside>

      <div className="mf-main">
        <header className="mf-topbar">
          <div>
            <span className="mf-mobile-brand">🍦 Scoop Aura</span>
            <span className="mf-admin-label">Admin Panel / Manage Flavours</span>
          </div>

          <div className="mf-top-right">
            <label className="mf-top-search">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search flavours..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <div className="mf-admin-user">
              <span>👤</span>
              <div>
                <strong>Admin</strong>
                <small>Scoop Aura</small>
              </div>
            </div>

            <button className="mf-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="mf-content">
          <section className="mf-hero">
            <div className="mf-hero-icon">🍦</div>
            <div>
              <p>FLAVOUR COLLECTION</p>
              <h1>Manage Flavours</h1>
              <span>
                Add new flavours, view available flavours or remove them
                from the customer menu.
              </span>
            </div>
            <div className="mf-hero-art">🍓 🍨 🍦</div>
          </section>

          {message && (
            <div
              className={`mf-message ${messageType}`}
              role="status"
            >
              {message}
              <button onClick={() => setMessage("")} aria-label="Dismiss message">
                ×
              </button>
            </div>
          )}

          <section className="mf-toolbar">
            <div className="mf-mode-buttons">
              <button
                className={`mf-action-button ${activeMode === "add" ? "selected" : ""}`}
                onClick={() => handleModeChange(activeMode === "add" ? "view" : "add")}
              >
                <span>＋</span> Add Flavour
              </button>

              <button
                className={`mf-action-button light ${activeMode === "remove" ? "selected" : ""}`}
                onClick={() => handleModeChange(activeMode === "remove" ? "view" : "remove")}
              >
                <span>▤</span> Remove Flavours
              </button>
            </div>

            {activeMode === "remove" && (
              <button
                className="mf-delete-button"
                onClick={handleDeleteSelected}
              >
                🗑 Delete Selected ({selectedIds.length})
              </button>
            )}
          </section>

          {activeMode === "add" && (
            <section className="mf-form-card">
              <div className="mf-form-heading">
                <div className="mf-form-title">
                  <span>🍦</span>
                  <div>
                    <h2>Add New Flavour</h2>
                    <p>Upload a picture and enter the flavour name.</p>
                  </div>
                </div>
                <button
                  className="mf-close-form"
                  onClick={() => handleModeChange("view")}
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddFlavour}>
                <div className="mf-form-layout">
                  <div>
                    <label className="mf-field-label">Flavour Image</label>

                    <button
                      type="button"
                      className="mf-upload-box"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Flavour preview" />
                      ) : (
                        <>
                          <span className="mf-upload-icon">▧</span>
                          <strong>Upload Flavour Image</strong>
                          <small>Click to choose an image</small>
                          <small>JPG, PNG, WEBP · Max 2 MB</small>
                        </>
                      )}
                    </button>

                    <input
                      ref={fileInputRef}
                      className="mf-file-input"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                    />
                  </div>

                  <div className="mf-name-field">
                    <label className="mf-field-label" htmlFor="flavour-name">
                      Flavour Name
                    </label>
                    <input
                      id="flavour-name"
                      type="text"
                      placeholder="Enter flavour name"
                      maxLength={80}
                      value={flavourName}
                      onChange={(event) => setFlavourName(event.target.value)}
                    />

                    <div className="mf-preview-card">
                      <span>Image Preview</span>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Selected flavour preview" />
                      ) : (
                        <div className="mf-empty-preview">
                          <span>▧</span>
                          <small>No image selected</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mf-form-actions">
                  <button
                    type="button"
                    className="mf-cancel-button"
                    onClick={() => handleModeChange("view")}
                  >
                    Cancel
                  </button>
                  <button className="mf-submit-button" type="submit">
                    ＋ Add Flavour
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="mf-flavour-section">
            <div className="mf-list-heading">
              <div>
                <h2>All Available Flavours ({filteredFlavours.length})</h2>
                <p>
                  {activeMode === "remove"
                    ? "Select multiple flavours using the checkboxes."
                    : "These are the flavours currently shown in this demo."}
                </p>
              </div>

              {activeMode === "remove" && (
                <label className="mf-select-all">
                  <input
                    type="checkbox"
                    checked={
                      filteredFlavours.length > 0 &&
                      filteredFlavours.every((flavour) =>
                        selectedIds.includes(flavour.id)
                      )
                    }
                    onChange={selectAllVisible}
                  />
                  Select all
                </label>
              )}
            </div>

            {filteredFlavours.length > 0 ? (
              <div className="mf-flavour-grid">
                {filteredFlavours.map((flavour) => {
                  const selected = selectedIds.includes(flavour.id);

                  return (
                    <article
                      key={flavour.id}
                      className={`mf-flavour-card ${selected ? "checked" : ""}`}
                      onClick={() => {
                        if (activeMode === "remove") {
                          toggleSelection(flavour.id);
                        }
                      }}
                    >
                      {activeMode === "remove" && (
                        <input
                          className="mf-card-checkbox"
                          type="checkbox"
                          checked={selected}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => toggleSelection(flavour.id)}
                          aria-label={`Select ${flavour.name}`}
                        />
                      )}

                      <div
                        className="mf-flavour-picture"
                        style={{ backgroundColor: flavour.color || "#ffe5ef" }}
                      >
                        {flavour.image ? (
                          <img src={flavour.image} alt={flavour.name} />
                        ) : (
                          <span>{flavour.emoji}</span>
                        )}
                      </div>

                      <h3>{flavour.name}</h3>

                      <span className="mf-visibility">
                        <i /> Visible in demo
                      </span>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mf-no-results">
                <span>🍦</span>
                <h3>No flavours found</h3>
                <p>Try a different search or add a new flavour.</p>
              </div>
            )}
          </section>

          <footer className="mf-footer">
            © {new Date().getFullYear()} Scoop Aura · Taste the Happiness 🍨
          </footer>
        </main>
      </div>
    </div>
  );
}

export default ManageFlavours;

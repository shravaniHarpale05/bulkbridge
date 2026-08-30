import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import api from "../services/api";
import { dashboardPathForRole, getUser, saveAuth } from "../utils/auth";

const EMPTY_FORM = {
  name: "",
  phone: "",
  farmName: "",
  farmLocation: "",
  mainProduce: "",
  businessName: "",
  businessLocation: "",
  buyingCategory: "",
};

export default function Profile() {
  const navigate = useNavigate();
  const cachedUser = getUser();
  const [user, setUser] = useState(cachedUser);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(Boolean(cachedUser));
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isFarmer = user?.role?.toLowerCase() === "farmer";

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "—";
    const date = new Date(user.createdAt);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  }, [user?.createdAt]);

  useEffect(() => {
    if (!cachedUser) return;

    let active = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/users/me");
        if (!active) return;
        const freshUser = response.data.user;
        setUser(freshUser);
        saveAuth(freshUser, localStorage.getItem("bulkbridge_token"));
      } catch (err) {
        if (active) setError(err.response?.data?.message || "Unable to load your profile.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const startEditing = () => {
    if (!user) return;
    setForm({
      ...EMPTY_FORM,
      name: user.name || "",
      phone: user.phone || "",
      farmName: user.farmName || "",
      farmLocation: user.farmLocation || "",
      mainProduce: user.mainProduce || "",
      businessName: user.businessName || "",
      businessLocation: user.businessLocation || "",
      buyingCategory: user.buyingCategory || "",
    });
    setMessage("");
    setError("");
    setEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!user) return;

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put(`/api/users/update/${user._id}`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        ...(isFarmer
          ? {
              farmName: form.farmName.trim(),
              farmLocation: form.farmLocation.trim(),
              mainProduce: form.mainProduce.trim(),
            }
          : {
              businessName: form.businessName.trim(),
              businessLocation: form.businessLocation.trim(),
              buyingCategory: form.buyingCategory.trim(),
            }),
      });

      const updatedUser = response.data.user;
      const token = localStorage.getItem("bulkbridge_token");
      saveAuth(updatedUser, token);
      setUser(updatedUser);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <div className="profile-empty-icon">👤</div>
          <h1>My Profile</h1>
          <p>Please log in to view your profile.</p>
          <button className="profile-back-btn" onClick={() => navigate("/login")}>← Login</button>
        </div>
      </div>
    );
  }

  const dashboardPath = dashboardPathForRole(user.role);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <span className="profile-tag">👤 {isFarmer ? "Farmer Account" : "Buyer Account"}</span>
          <h1>My Profile</h1>
          <p>Keep your BulkBridge account information accurate and up to date.</p>
        </div>
        <button className="profile-back-btn" onClick={() => navigate(dashboardPath)}>← Dashboard</button>
      </div>

      {message && <div className="profile-alert success">✓ {message}</div>}
      {error && <div className="profile-alert error">! {error}</div>}

      {loading ? (
        <div className="profile-loading">Loading your profile...</div>
      ) : (
        <div className="profile-container">
          <aside className="profile-sidebar">
            <div className="profile-avatar">{isFarmer ? "👨‍🌾" : "🛒"}</div>
            <h2>{user.name || "User"}</h2>
            <p>BulkBridge {isFarmer ? "Farmer / Seller" : "Buyer"}</p>
            <span className="profile-status">● Active</span>
            <div className="profile-member-card">
              <span>Member since</span>
              <strong>{memberSince}</strong>
            </div>
          </aside>

          <main className="profile-details">
            <div className="profile-section-header">
              <div>
                <h2>Personal Information</h2>
                <p>Your account details are securely loaded from your profile.</p>
              </div>
              {!editing && (
                <button className="edit-profile-btn" onClick={startEditing}>✎ Edit Profile</button>
              )}
            </div>

            {editing ? (
              <form className="profile-edit-form" onSubmit={handleSave}>
                <div className="profile-grid">
                  <div className="profile-field edit-field">
                    <label>Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="profile-field edit-field">
                    <label>Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="profile-readonly-row">
                  <span>Email Address</span>
                  <strong>{user.email}</strong>
                  <small>Email cannot be changed from this page.</small>
                </div>

                {isFarmer ? (
                  <div className="farm-section">
                    <h2>Farm Information</h2>
                    <p>Tell buyers more about your farm and the produce you supply.</p>
                    <div className="profile-grid">
                      <div className="profile-field edit-field"><label>Farm Name</label><input name="farmName" value={form.farmName} onChange={handleChange} placeholder="e.g. Harpale Farms" /></div>
                      <div className="profile-field edit-field"><label>Farm Location</label><input name="farmLocation" value={form.farmLocation} onChange={handleChange} placeholder="e.g. Pune, Maharashtra" /></div>
                      <div className="profile-field edit-field"><label>Main Produce</label><input name="mainProduce" value={form.mainProduce} onChange={handleChange} placeholder="e.g. Tomato, Onion" /></div>
                    </div>
                  </div>
                ) : (
                  <div className="farm-section">
                    <h2>Business Information</h2>
                    <p>Help farmers understand your business and buying requirements.</p>
                    <div className="profile-grid">
                      <div className="profile-field edit-field"><label>Business Name</label><input name="businessName" value={form.businessName} onChange={handleChange} placeholder="e.g. Fresh Market" /></div>
                      <div className="profile-field edit-field"><label>Business Location</label><input name="businessLocation" value={form.businessLocation} onChange={handleChange} placeholder="e.g. Pune, Maharashtra" /></div>
                      <div className="profile-field edit-field"><label>Buying Category</label><input name="buyingCategory" value={form.buyingCategory} onChange={handleChange} placeholder="e.g. Vegetables, Fruits" /></div>
                    </div>
                  </div>
                )}

                <div className="profile-edit-actions">
                  <button type="button" className="profile-cancel-btn" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
                  <button type="submit" className="profile-save-btn" disabled={saving}>{saving ? "Saving..." : "✓ Save Changes"}</button>
                </div>
              </form>
            ) : (
              <>
                <div className="profile-grid">
                  <div className="profile-field"><label>Full Name</label><div>{user.name || "Not added"}</div></div>
                  <div className="profile-field"><label>Email Address</label><div>{user.email || "Not available"}</div></div>
                  <div className="profile-field"><label>Phone Number</label><div>{user.phone || "Not added"}</div></div>
                  <div className="profile-field"><label>Account Type</label><div>{isFarmer ? "Farmer / Seller" : "Buyer"}</div></div>
                  <div className="profile-field"><label>Location</label><div>{isFarmer ? user.farmLocation || "Not added" : user.businessLocation || "Not added"}</div></div>
                  <div className="profile-field"><label>Member Since</label><div>{memberSince}</div></div>
                </div>

                {isFarmer ? (
                  <div className="farm-section">
                    <h2>Farm Information</h2>
                    <p>Information buyers can use when considering your produce.</p>
                    <div className="profile-grid">
                      <div className="profile-field"><label>Farm Name</label><div>{user.farmName || "Not added"}</div></div>
                      <div className="profile-field"><label>Farm Location</label><div>{user.farmLocation || "Not added"}</div></div>
                      <div className="profile-field"><label>Main Produce</label><div>{user.mainProduce || "Not added"}</div></div>
                      <button className="profile-link-field" onClick={() => navigate("/my-produce")}><span>🥬</span><span><strong>My Produce</strong><small>Manage your listings</small></span>→</button>
                    </div>
                  </div>
                ) : (
                  <div className="farm-section">
                    <h2>Business Information</h2>
                    <p>Information connected to your buying account.</p>
                    <div className="profile-grid">
                      <div className="profile-field"><label>Business Name</label><div>{user.businessName || "Not added"}</div></div>
                      <div className="profile-field"><label>Business Location</label><div>{user.businessLocation || "Not added"}</div></div>
                      <div className="profile-field"><label>Buying Category</label><div>{user.buyingCategory || "Not added"}</div></div>
                      <button className="profile-link-field" onClick={() => navigate("/retailer-orders")}><span>🛒</span><span><strong>My Orders</strong><small>Track your purchases</small></span>→</button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!editing && (
              <div className="profile-actions">
                {isFarmer && <button className="profile-produce-btn" onClick={() => navigate("/my-produce")}>🥬 My Produce</button>}
                {!isFarmer && <button className="profile-produce-btn" onClick={() => navigate("/retailer-orders")}>🛒 My Orders</button>}
                <button className="profile-settings-btn" onClick={() => navigate("/settings")}>⚙️ Settings</button>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

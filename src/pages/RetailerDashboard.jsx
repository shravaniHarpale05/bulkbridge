import React, { useEffect, useState } from "react";
import "../styles/RetailerDashboard.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUser, logout } from "../utils/auth";

export default function RetailerDashboard() {

  const navigate = useNavigate();
  const buyer = getUser();

  const [produce, setProduce] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {

    if (!buyer?._id) return;

    const fetchData = async () => {

      try {

        const [produceRes, ordersRes] = await Promise.all([
          api.get("/api/produce"),
          api.get(`/api/orders/buyer/${buyer._id}`)
        ]);

        setProduce(produceRes.data.filter((p) => p.status === "Available"));
        setOrders(ordersRes.data);

      } catch (error) {
        console.log("Error fetching dashboard data:", error);
      }

    };

    fetchData();

  }, [buyer?._id]);

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const completedOrders = orders.filter((o) => o.status === "Completed");
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="retailer-dashboard">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">

          <div className="logo-leaf">
            🛒
          </div>

          <div>
            <h2>BulkBridge</h2>
            <span>For Retailers & Buyers</span>
          </div>

        </div>


        <nav className="dashboard-nav">

          <a href="#" className="nav-item active">
            🏠
            <span>Dashboard</span>
          </a>

          <a
            type="button"
            className="nav-item"
            onClick={() => navigate("/browse-produce")}
          >
            🥬
            <span>Browse Produce</span>
          </a>

          <a
            type="button"
            className="nav-item"
            onClick={() => navigate("/retailer-orders")}
          >
            📦
            <span>My Orders</span>
          </a>

          <a
            type="button"
            className="nav-item"
            onClick={() => navigate("/profile")}
          >
            👤
            <span>Profile</span>
          </a>

          <a type="button" className="nav-item" onClick={() => navigate("/messages")}>💬<span>Messages</span></a>
          <a type="button" className="nav-item" onClick={() => navigate("/settings")}>⚙️<span>Settings</span></a>

        </nav>


        <div className="sidebar-promo">
          <h3>Buy Fresh, Buy Bulk!</h3>
          <p>Browse verified farmer listings and order in bulk.</p>
          <button onClick={() => navigate("/browse-produce")}>Browse Now →</button>
        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        <header className="dashboard-topbar">

          <button className="menu-btn">☰</button>

          <div className="dashboard-user">

            <div className="user-avatar">🧑‍💼</div>

            <div>
              <strong>{buyer?.name || "Buyer"}</strong>
              <span>BulkBridge Retailer</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              style={{ marginLeft: "10px", background: "none", border: "1px solid #ddd", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
            >
              Logout
            </button>

          </div>

        </header>


        <div className="dashboard-content">

          <section className="welcome-banner">

            <div>
              <span className="welcome-tag">🛒 Retailer Dashboard</span>
              <h1>Welcome to BulkBridge! 👋</h1>
              <p>Browse fresh produce from farmers and order in bulk.</p>
            </div>

            <div className="welcome-illustration">🥕 🍇 🧅</div>

          </section>


          <section className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon green">🥬</div>
              <div>
                <span>Available Produce</span>
                <h2>{produce.length}</h2>
                <small>Items to browse</small>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/browse-produce"); }}>
                Browse →
              </a>
            </div>

            <div className="stat-card">
              <div className="stat-icon yellow">📦</div>
              <div>
                <span>Pending Orders</span>
                <h2>{pendingOrders.length}</h2>
                <small>Orders</small>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/retailer-orders"); }}>
                View all →
              </a>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">✅</div>
              <div>
                <span>Completed Orders</span>
                <h2>{completedOrders.length}</h2>
                <small>Orders</small>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/retailer-orders"); }}>
                View all →
              </a>
            </div>

            <div className="stat-card">
              <div className="stat-icon money">₹</div>
              <div>
                <span>Total Spent</span>
                <h2>₹{totalSpent}</h2>
                <small>{totalSpent > 0 ? "Across all orders" : "Start ordering"}</small>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/retailer-orders"); }}>
                View details →
              </a>
            </div>

          </section>


          <section className="getting-started">

            <div>
              <span>🥕</span>
              <div>
                <h2>Ready to place a bulk order?</h2>
                <p>Browse listings from farmers near you and buy in bulk.</p>
              </div>
            </div>

            <button onClick={() => navigate("/browse-produce")}>
              Browse Produce
            </button>

          </section>

        </div>

      </main>

    </div>
  );
}

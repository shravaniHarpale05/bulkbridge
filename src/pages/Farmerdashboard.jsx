import React, { useEffect, useState } from "react";
import "../styles/FarmerDashboard.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUser, logout } from "../utils/auth";

export default function FarmerDashboard() {

  const navigate = useNavigate();
  const farmer = getUser();

  const [produce, setProduce] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch this farmer's produce and orders from MongoDB
  useEffect(() => {

    if (!farmer?._id) return;

    const fetchData = async () => {

      try {

        const [produceRes, ordersRes] = await Promise.all([
          api.get(`/api/produce/farmer/${farmer._id}`),
          api.get(`/api/orders/farmer/${farmer._id}`)
        ]);

        setProduce(produceRes.data);
        setOrders(ordersRes.data);

      } catch (error) {

        console.log("Error fetching dashboard data:", error);

      }

    };

    fetchData();

  }, [farmer?._id]);

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const completedOrders = orders.filter((o) => o.status === "Completed");
  const totalEarnings = completedOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  return (
    <div className="farmer-dashboard">


      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">

          <div className="logo-leaf">
            🌱
          </div>

          <div>

            <h2>BulkBridge</h2>

            <span>
              For Farmers, With Farmers
            </span>

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
            onClick={() => navigate("/my-produce")}
          >
            🥬
            <span>My Produce</span>
          </a>


          <a
          type="button"
          className="nav-item"
          onClick={() => navigate("/orders")}
        >
          📦
          <span>Orders</span>
        </a>

        <a type="button" className="nav-item" onClick={() => navigate("/sales-earnings")}>
            ₹
            <span>Sales & Earnings</span>
          </a>


          <a
  type="button"
  className="nav-item"
  onClick={() => navigate("/messages")}
>
  💬
  <span>Messages</span>
</a>


          <a
  type="button"
  className="nav-item"
  onClick={() => navigate("/profile")}
>
  👤
  <span>Profile</span>
</a>


         <a
  type="button"
  className="nav-item"
  onClick={() => navigate("/settings")}
>
  ⚙️
  <span>Settings</span>
</a>
        </nav>


        {/* PROMOTION */}

        <div className="sidebar-promo">

          <h3>
            Sell More, Earn More!
          </h3>

          <p>
            Add your fresh produce and reach more buyers.
          </p>

          <button onClick={() => navigate("/services")}>
  Learn More →
</button>

        </div>

      </aside>



      {/* MAIN CONTENT */}

      <main className="dashboard-main">


        {/* TOP BAR */}

        <header className="dashboard-topbar">

          <button className="menu-btn">
            ☰
          </button>


          <div className="dashboard-user">

            <div className="user-avatar">
              👨‍🌾
            </div>


            <div>

              <strong>
                {farmer?.name || "Farmer"}
              </strong>

              <span>
                BulkBridge Farmer
              </span>

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



        {/* CONTENT */}

        <div className="dashboard-content">


          {/* WELCOME BANNER */}

          <section className="welcome-banner">

            <div>

              <span className="welcome-tag">
                🌱 Farmer Dashboard
              </span>


              <h1>
                Welcome to BulkBridge! 👋
              </h1>


              <p>
                Your farmer account is ready.
                Start adding your produce and reach buyers.
              </p>

            </div>


            <div className="welcome-illustration">
              🌾 🥕 🍅
            </div>

          </section>



          {/* STATISTICS */}

          <section className="stats-grid">


            {/* TOTAL PRODUCE */}

            <div className="stat-card">

              <div className="stat-icon green">
                🥬
              </div>


              <div>

                <span>
                  Total Produce
                </span>

                <h2>
                  {produce.length}
                </h2>

                <small>
                  Items listed
                </small>

              </div>


              <a  href="#" onClick={(e) => { e.preventDefault(); navigate("/my-produce"); }}>
              View all →
            </a>
            </div>

            {/* PENDING ORDERS */}

            <div className="stat-card">

              <div className="stat-icon yellow">
                📦
              </div>


              <div>

                <span>
                  Pending Orders
                </span>

                <h2>
                  {pendingOrders.length}
                </h2>

                <small>
                  Orders
                </small>

              </div>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/orders");
              }}
            >
              View all →
            </a>

            </div>



            {/* COMPLETED ORDERS */}

            <div className="stat-card">

              <div className="stat-icon purple">
                ✅
              </div>


              <div>

                <span>
                  Completed Orders
                </span>

                <h2>
                  {completedOrders.length}
                </h2>

                <small>
                  Orders
                </small>

              </div>


             <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/orders");
              }}
            >
            View all →
            </a>
            </div>



            {/* TOTAL EARNINGS */}

            <div className="stat-card">

              <div className="stat-icon money">
                ₹
              </div>


              <div>

                <span>
                  Total Earnings
                </span>

                <h2>
                  ₹{totalEarnings}
                </h2>

                <small>
                  {totalEarnings > 0 ? "From completed orders" : "Start selling to earn"}
                </small>

              </div>


              <a href="/sales-earnings">
                View details →
              </a>

            </div>

          </section>



          {/* MIDDLE SECTION */}

          <section className="dashboard-grid">


            {/* RECENT ORDERS */}

            {/* RECENT ORDERS */}

<div className="dashboard-box orders-box">

  <div className="box-header">
    <div>
      <h2>Recent Orders</h2>
      <p className="box-subtitle">
        Latest orders from your buyers
      </p>
    </div>

    <button
      className="view-btn"
      onClick={() => navigate("/orders")}
    >
      View all →
    </button>
  </div>

  {orders.length === 0 ? (

    <div className="orders-empty">

      <div className="orders-empty-icon">
        📦
      </div>

      <h3>No orders yet</h3>

      <p>
        When buyers purchase your produce,
        their orders will appear here.
      </p>

      <button
        className="orders-view-btn"
        onClick={() => navigate("/orders")}
      >
        View Orders
      </button>

    </div>

  ) : (

    <div className="orders-empty">
      <h3>{orders.length} order{orders.length !== 1 ? "s" : ""} received</h3>
      <p>
        Most recent: {orders[0].produceName} × {orders[0].quantity}kg from {orders[0].buyerName}
      </p>
      <button
        className="orders-view-btn"
        onClick={() => navigate("/orders")}
      >
        View Orders
      </button>
    </div>

  )}

</div>



            {/* EARNINGS */}

            <div className="dashboard-box">

              <div className="box-header">

                <h2>
                  Earnings Overview
                </h2>


                <select>

                  <option>
                    This Month
                  </option>

                  <option>
                    Last Month
                  </option>

                </select>

              </div>


              <div className="earnings-empty">

                <div className="earnings-icon">
                  ₹
                </div>

                <h2>
                  ₹0
                </h2>

                <p>
                  No earnings yet
                </p>

                <span>
                  Complete your first order to start
                  tracking your earnings.
                </span>

              </div>

            </div>

          </section>



          {/* BOTTOM SECTION */}

          <section className="dashboard-grid bottom-grid">


            {/* MY PRODUCE */}

            <div className="dashboard-box produce-box">


              <div className="box-header">

                <h2>
                  My Produce
                </h2>


                <button
                  className="view-btn"
                  onClick={() => navigate("/my-produce")}
                >
                  View all
                </button>

              </div>



              {produce.length === 0 ? (

                <div className="produce-empty">

                  <div className="produce-icon">
                    🥬
                  </div>

                  <h3>
                    No produce listed
                  </h3>

                  <p>
                    Start selling by adding your
                    first vegetable or fruit.
                  </p>

                  <button
                    className="add-produce-btn"
                    onClick={() => navigate("/my-produce")}
                  >
                    + Add Your First Produce
                  </button>

                </div>

              ) : (

                <div className="produce-empty">

                  <div className="produce-icon">
                    🥬
                  </div>

                  <h3>
                    {produce.length} Produce Listed
                  </h3>

                  <p>
                    Your produce is available for buyers.
                  </p>

                  <button
                    className="add-produce-btn"
                    onClick={() => navigate("/my-produce")}
                  >
                    View My Produce →
                  </button>

                </div>

              )}

            </div>



            {/* QUICK ACTIONS */}

            <div className="dashboard-box">

              <div className="box-header">

                <h2>
                  Quick Actions
                </h2>

              </div>


              <div className="quick-actions">

                <button
                  onClick={() => navigate("/my-produce")}
                >
                  <span>🥬</span>
                  Add Produce
                </button>


                <button onClick={() => navigate("/orders")}>
                  <span>📦</span>
                  View Orders
                </button>


                <button onClick={() => navigate("/messages")}>
                  <span>💬</span>
                  Check Messages
                </button>


                <button onClick={() => navigate("/profile")}>
                  <span>👤</span>
                  Update Profile
                </button>

              </div>

            </div>

          </section>



          {/* GET STARTED */}

          <section className="getting-started">

            <div>

              <span>
                🚜
              </span>


              <div>

                <h2>
                  Ready to start selling?
                </h2>

                <p>
                  Add your fresh produce and connect
                  with retailers and buyers.
                </p>

              </div>

            </div>


            <button
              onClick={() => navigate("/my-produce")}
            >
              + Add Produce
            </button>

          </section>


        </div>

      </main>

    </div>
  );
}
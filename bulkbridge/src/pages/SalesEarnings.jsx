import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SalesEarnings.css";
import { getUser } from "../utils/auth";

export default function SalesEarnings() {

  const navigate = useNavigate();
  const farmer = getUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!farmer?._id) return;

    const fetchOrders = async () => {

      try {

        const response = await axios.get(
          `http://localhost:5000/api/orders/farmer/${farmer._id}`
        );

        setOrders(response.data);

      } catch (error) {

        console.log("Error fetching orders:", error);

      } finally {
        setLoading(false);
      }

    };

    fetchOrders();

  }, [farmer?._id]);

  const completedOrders = orders.filter((o) => o.status === "Completed");
  const pendingOrders = orders.filter((o) => o.status === "Pending");

  const totalEarnings = completedOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  const pendingAmount = pendingOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  // ---- Group completed sales by month for the bar chart ----
  const monthlyTotals = {};
  completedOrders.forEach((o) => {
    const month = new Date(o.orderDate).toLocaleString("default", { month: "short", year: "2-digit" });
    monthlyTotals[month] = (monthlyTotals[month] || 0) + Number(o.totalAmount || 0);
  });
  const monthEntries = Object.entries(monthlyTotals).slice(-6);
  const maxMonthTotal = Math.max(1, ...monthEntries.map(([, total]) => total));

  // ---- Top-selling produce by revenue ----
  const produceTotals = {};
  completedOrders.forEach((o) => {
    produceTotals[o.produceName] = (produceTotals[o.produceName] || 0) + Number(o.totalAmount || 0);
  });
  const topProduce = Object.entries(produceTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="sales-page">

      {/* HEADER */}

      <div className="sales-header">

        <div>
          <span className="sales-tag">
            💰 Farmer Finance
          </span>

          <h1>Sales & Earnings</h1>

          <p>
            Track your sales, orders and earnings in one place.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/farmer-dashboard")}
        >
          ← Dashboard
        </button>

      </div>


      {/* STATISTICS */}

      <section className="sales-stats">

        <div className="sales-card">
          <div className="sales-icon green-icon">₹</div>
          <div>
            <span>Total Earnings</span>
            <h2>₹{totalEarnings}</h2>
            <small>All time earnings</small>
          </div>
        </div>

        <div className="sales-card">
          <div className="sales-icon yellow-icon">📦</div>
          <div>
            <span>Total Orders</span>
            <h2>{orders.length}</h2>
            <small>Orders received</small>
          </div>
        </div>

        <div className="sales-card">
          <div className="sales-icon purple-icon">✅</div>
          <div>
            <span>Completed Orders</span>
            <h2>{completedOrders.length}</h2>
            <small>Successfully completed</small>
          </div>
        </div>

        <div className="sales-card">
          <div className="sales-icon orange-icon">⏳</div>
          <div>
            <span>Pending Amount</span>
            <h2>₹{pendingAmount}</h2>
            <small>Awaiting completion</small>
          </div>
        </div>

      </section>


      {/* SALES OVERVIEW — simple CSS bar chart, no charting library needed */}

      <section className="sales-box">

        <div className="sales-box-header">
          <div>
            <h2>Sales Overview</h2>
            <p>Completed sales by month</p>
          </div>
        </div>

        {loading ? (
          <div className="sales-empty">
            <p>Loading…</p>
          </div>
        ) : monthEntries.length === 0 ? (
          <div className="sales-empty">
            <div className="sales-chart-icon">📊</div>
            <h3>No sales data yet</h3>
            <p>Your sales overview will appear here after you complete your first order.</p>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "18px", height: "180px", padding: "20px 10px 0" }}>
            {monthEntries.map(([month, total]) => (
              <div key={month} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ fontSize: "12px", marginBottom: "6px", fontWeight: 600 }}>₹{total}</div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: "48px",
                    height: `${Math.max(6, (total / maxMonthTotal) * 130)}px`,
                    background: "#2e7d32",
                    borderRadius: "6px 6px 0 0"
                  }}
                />
                <div style={{ fontSize: "12px", color: "#777", marginTop: "8px" }}>{month}</div>
              </div>
            ))}
          </div>
        )}

      </section>


      {/* RECENT SALES */}

      <section className="sales-box">

        <div className="sales-box-header">

          <div>
            <h2>Top Selling Produce</h2>
            <p>Ranked by revenue from completed orders</p>
          </div>

          <button
            className="view-orders-btn"
            onClick={() => navigate("/orders")}
          >
            View Orders →
          </button>

        </div>

        {topProduce.length === 0 ? (

          <div className="sales-empty">
            <div className="sales-chart-icon">🧾</div>
            <h3>No sales yet</h3>
            <p>Completed orders will appear here.</p>
          </div>

        ) : (

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px 4px" }}>
            {topProduce.map(([name, total], i) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f6f9f5", borderRadius: "10px" }}>
                <span>#{i + 1} {name}</span>
                <strong>₹{total}</strong>
              </div>
            ))}
          </div>

        )}

      </section>


      {/* GET STARTED */}

      <section className="sales-start">

        <div>

          <span>🌱</span>

          <div>
            <h2>Start selling to earn!</h2>

            <p>
              Add your fresh produce and connect
              with buyers.
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
  );
}

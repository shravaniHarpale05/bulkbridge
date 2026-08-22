import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Orders.css";
import { getUser } from "../utils/auth";

export default function RetailerOrders() {

  const navigate = useNavigate();
  const buyer = getUser();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("All");

  const fetchOrders = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await axios.get(
        `http://localhost:5000/api/orders/buyer/${buyer._id}`
      );

      setOrders(response.data);

    } catch (err) {

      console.log("Error fetching orders:", err);
      setError("Could not load your orders. Please try again.");

    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    if (buyer?._id) fetchOrders();
  }, [buyer?._id]);

  const filteredOrders =
    tab === "All" ? orders : orders.filter((o) => o.status === tab);

  return (
    <div className="orders-page">

      <div className="orders-header">

        <div>
          <span className="orders-tag">🛒 My Orders</span>
          <h1>Orders</h1>
          <p>Track the bulk orders you've placed with farmers.</p>
        </div>

        <button className="back-dashboard-btn" onClick={() => navigate("/retailer-dashboard")}>
          ← Dashboard
        </button>

      </div>

      <div className="orders-tabs">

        <button className={tab === "All" ? "active-tab" : ""} onClick={() => setTab("All")}>All Orders</button>
        <button className={tab === "Pending" ? "active-tab" : ""} onClick={() => setTab("Pending")}>Pending</button>
        <button className={tab === "Completed" ? "active-tab" : ""} onClick={() => setTab("Completed")}>Completed</button>

      </div>

      {loading ? (

        <div className="orders-main-box"><p>Loading orders…</p></div>

      ) : error ? (

        <div className="orders-main-box">
          <div className="big-order-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="add-produce-order-btn" onClick={fetchOrders}>Try Again</button>
        </div>

      ) : filteredOrders.length === 0 ? (

        <div className="orders-main-box">

          <div className="big-order-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Once you place a bulk order, it will show up here.</p>

          <button onClick={() => navigate("/browse-produce")} className="add-produce-order-btn">
            Browse Produce
          </button>

        </div>

      ) : (

        <div className="orders-list">

          {filteredOrders.map((order) => (

            <div className="orders-main-box" key={order._id} style={{ textAlign: "left", marginBottom: "16px" }}>

              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>

                <div>
                  <h2 style={{ margin: 0 }}>{order.produceName}</h2>
                  <p style={{ margin: "4px 0" }}>
                    {order.quantity} kg × ₹{order.price}/kg = ₹{order.totalAmount}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "13px", color: "#777" }}>
                    Ordered on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className="available-badge"
                  style={
                    order.status === "Completed"
                      ? { background: "#e6f4ea", color: "#2e7d32" }
                      : { background: "#fff8e1", color: "#b8860b" }
                  }
                >
                  {order.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

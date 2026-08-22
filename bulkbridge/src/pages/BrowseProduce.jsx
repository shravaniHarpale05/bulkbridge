import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BrowseProduce.css";

const CATEGORIES = ["All", "Vegetables", "Fruits", "Grains", "Seeds", "Spices"];

export default function BrowseProduce() {

  const navigate = useNavigate();

  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchProduce = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await axios.get("http://localhost:5000/api/produce");

      // Only show produce that's still within its availability window
      setProduce(response.data.filter((item) => item.status === "Available"));

    } catch (err) {

      console.log("Error fetching produce:", err);
      setError("Could not load produce. Please try again.");

    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchProduce();
  }, []);

  const visibleProduce = (() => {
    let list = category === "All" ? produce : produce.filter((item) => item.category === category);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }

    list = [...list];
    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "quantity") list.sort((a, b) => b.quantity - a.quantity);

    return list;
  })();

  const iconFor = (cat) =>
    cat === "Fruits" ? "🍎" :
    cat === "Grains" ? "🌾" :
    cat === "Seeds" ? "🌱" :
    cat === "Spices" ? "🌶️" : "🥬";

  return (
    <div className="browse-page">

      <div className="browse-header">

        <div>
          <span>🛒 Retailer Dashboard</span>
          <h1>Browse Produce</h1>
          <p>Fresh produce currently available from farmers on BulkBridge.</p>
        </div>

        <button className="back-dashboard-btn" onClick={() => navigate("/retailer-dashboard")}>
          ← Dashboard
        </button>

      </div>

      <div className="browse-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active-filter" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>

        <input
          type="text"
          placeholder="Search produce by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: "220px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #dbe4ee" }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #dbe4ee" }}
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="quantity">Most Stock</option>
        </select>

      </div>

      {loading ? (

        <div className="browse-empty">Loading available produce…</div>

      ) : error ? (

        <div className="browse-empty">
          <p>{error}</p>
          <button className="view-details-btn" onClick={fetchProduce}>Try Again</button>
        </div>

      ) : visibleProduce.length === 0 ? (

        <div className="browse-empty">
          <h2>No produce available right now</h2>
          <p>Check back soon — farmers add new listings regularly.</p>
        </div>

      ) : (

        <div className="produce-grid">

          {visibleProduce.map((item) => (

            <div className="produce-card" key={item._id}>

              <div className="produce-card-icon">{iconFor(item.category)}</div>

              <h3>{item.name}</h3>
              <span className="category-tag">{item.category}</span>

              <div className="price-row">
                <span>{item.quantity} kg available</span>
                <strong>₹{item.price}/kg</strong>
              </div>

              <button
                className="view-details-btn"
                onClick={() => navigate(`/produce/${item._id}`)}
              >
                View Details
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

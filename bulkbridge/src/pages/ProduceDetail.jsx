import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "../styles/BrowseProduce.css";
import { getUser } from "../utils/auth";

export default function ProduceDetail() {

  const { id } = useParams();
  const navigate = useNavigate();
  const buyer = getUser();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {

    const fetchItem = async () => {

      setLoading(true);
      setError("");

      try {

        const response = await axios.get(`http://localhost:5000/api/produce/${id}`);
        setItem(response.data);
        setQuantity(1);

      } catch (err) {

        console.log("Error fetching produce:", err);
        setError("Could not load this produce listing.");

      } finally {
        setLoading(false);
      }

    };

    fetchItem();

  }, [id]);

  const handlePlaceOrder = async () => {

    if (!item) return;

    setPlacing(true);

    try {

      await axios.post("http://localhost:5000/api/orders/add", {
        produceId: item._id,
        farmerId: item.farmerId,
        buyerId: buyer._id,
        buyerName: buyer.name,
        produceName: item.name,
        quantity: Number(quantity),
        price: item.price,
        totalAmount: Number(quantity) * item.price
      });

      alert("Order placed successfully!");
      navigate("/retailer-orders");

    } catch (err) {

      console.log("Error placing order:", err);
      alert(err.response?.data?.message || "Failed to place order");

    } finally {
      setPlacing(false);
    }

  };

  if (loading) {
    return <div className="detail-page"><div className="detail-card">Loading…</div></div>;
  }

  if (error || !item) {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <h2>{error || "Produce not found"}</h2>
          <Link to="/browse-produce">← Back to Browse Produce</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">

      <div className="detail-card">

        <Link to="/browse-produce">← Back to Browse Produce</Link>

        <h1>{item.name}</h1>
        <span className="category-tag">{item.category}</span>

        <div className="detail-meta">

          <div>
            <small>Price</small>
            <strong>₹{item.price}/kg</strong>
          </div>

          <div>
            <small>Available Stock</small>
            <strong>{item.quantity} kg</strong>
          </div>

          <div>
            <small>Available Until</small>
            <strong>{item.availableUntil?.slice(0, 10)}</strong>
          </div>

        </div>

        <h3>Select Quantity (kg)</h3>

        <div className="qty-selector">

          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>

          <input
            type="number"
            min="1"
            max={item.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.min(item.quantity, Math.max(1, Number(e.target.value))))}
          />

          <button type="button" onClick={() => setQuantity((q) => Math.min(item.quantity, q + 1))}>+</button>

        </div>

        <div className="order-total">
          Total: ₹{(quantity * item.price).toFixed(2)}
        </div>

        <button
          className="place-order-btn"
          onClick={handlePlaceOrder}
          disabled={placing || item.quantity < 1}
        >
          {placing ? "Placing Order…" : item.quantity < 1 ? "Out of Stock" : "Place Order"}
        </button>

      </div>

    </div>
  );
}

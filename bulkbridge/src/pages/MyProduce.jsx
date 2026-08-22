import React, { useState, useEffect } from "react";
import "../styles/MyProduce.css";
import axios from "axios";
import { getUser } from "../utils/auth";

export default function MyProduce() {

  const farmer = getUser();
  const farmerId = farmer?._id;

  const isExpiringSoon = (dateStr) => {
    const days = (new Date(dateStr) - new Date(new Date().toDateString())) / 86400000;
    return days >= 0 && days <= 2;
  };

  const [showForm, setShowForm] = useState(false);
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    availableUntil: ""
  });


  // =====================================
  // FETCH THIS FARMER'S PRODUCE FROM MONGODB
  // =====================================

  const fetchProduce = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await axios.get(
        `http://localhost:5000/api/produce/farmer/${farmerId}`
      );

      setProduce(response.data);

    } catch (err) {

      console.log("Error fetching produce:", err);
      setError("Could not load your produce. Please check your connection and try again.");

    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    if (farmerId) {
      fetchProduce();
    }
  }, [farmerId]);


  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      availableUntil: ""
    });
    setEditingId(null);
    setShowForm(false);
  };


  // =====================================
  // ADD OR UPDATE PRODUCE
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        // ---- EDIT EXISTING PRODUCE ----

        const response = await axios.put(
          `http://localhost:5000/api/produce/${editingId}`,
          {
            name: formData.name,
            category: formData.category,
            quantity: Number(formData.quantity),
            price: Number(formData.price),
            availableUntil: formData.availableUntil
          }
        );

        setProduce(
          produce.map((item) =>
            item._id === editingId ? response.data.produce : item
          )
        );

        alert("Produce updated successfully!");

      } else {

        // ---- ADD NEW PRODUCE ----

        const dataToSend = {
          farmerId: farmerId,
          name: formData.name,
          category: formData.category,
          quantity: Number(formData.quantity),
          price: Number(formData.price),
          availableUntil: formData.availableUntil
        };

        const response = await axios.post(
          "http://localhost:5000/api/produce/add",
          dataToSend
        );

        setProduce([response.data.produce, ...produce]);

        alert("Produce added successfully!");

      }

      resetForm();

    } catch (err) {

      console.log("Error saving produce:", err);
      alert(err.response?.data?.message || "Failed to save produce");

    }

  };


  // =====================================
  // EDIT — populate form with existing item
  // =====================================

  const handleEditClick = (item) => {

    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      price: item.price,
      availableUntil: item.availableUntil?.slice(0, 10) || ""
    });

    setEditingId(item._id);
    setShowForm(true);

  };


  // =====================================
  // DELETE PRODUCE
  // =====================================

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this produce listing?")) return;

    try {

      await axios.delete(`http://localhost:5000/api/produce/${id}`);

      setProduce(produce.filter((item) => item._id !== id));

    } catch (err) {

      console.log("Error deleting produce:", err);
      alert("Failed to delete produce");

    }

  };


  return (

    <div className="produce-page">


      {/* HEADER */}

      <div className="produce-header">

        <div>

          <span>🌱 Farmer Dashboard</span>

          <h1>My Produce</h1>

          <p>
            Manage your vegetables, fruits and other fresh produce.
          </p>

        </div>


        <button
          className="add-produce-main-btn"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          + Add Produce
        </button>

      </div>



      {/* STAT CARDS */}

      <div className="produce-stats">


        <div className="produce-stat">

          <div className="produce-stat-icon">
            🥬
          </div>

          <div>

            <span>Total Produce</span>

            <h2>
              {produce.length}
            </h2>

          </div>

        </div>



        <div className="produce-stat">

          <div className="produce-stat-icon">
            📦
          </div>

          <div>

            <span>Total Quantity</span>

            <h2>

              {produce.reduce(
                (total, item) =>
                  total + Number(item.quantity || 0),
                0
              )}

              {" "}kg

            </h2>

          </div>

        </div>



        <div className="produce-stat">

          <div className="produce-stat-icon">
            💰
          </div>

          <div>

            <span>Listed Items</span>

            <h2>
              {produce.length}
            </h2>

          </div>

        </div>


      </div>



      {/* ADD / EDIT PRODUCE FORM */}

      {showForm && (

        <div className="produce-form-card">


          <div className="form-title">

            <div>

              <h2>{editingId ? "Edit Produce" : "Add New Produce"}</h2>

              <p>
                {editingId
                  ? "Update the details of this listing."
                  : "Add details about the produce you want to sell."}
              </p>

            </div>


            <button
              className="close-form"
              onClick={resetForm}
            >
              ✕
            </button>

          </div>



          <form onSubmit={handleSubmit}>


            <div className="form-grid">


              {/* PRODUCE NAME */}

              <div className="input-group">

                <label>
                  Produce Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Tomato"
                  required
                />

              </div>



              {/* CATEGORY */}

              <div className="input-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Vegetables">
                    Vegetables
                  </option>

                  <option value="Fruits">
                    Fruits
                  </option>

                  <option value="Grains">
                    Grains
                  </option>

                  <option value="Seeds">
                    Seeds
                  </option>

                  <option value="Spices">
                    Spices
                  </option>

                </select>

              </div>



              {/* QUANTITY */}

              <div className="input-group">

                <label>
                  Available Quantity
                </label>

                <div className="input-with-unit">

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    min="1"
                    required
                  />

                  <span>
                    kg
                  </span>

                </div>

              </div>



              {/* PRICE */}

              <div className="input-group">

                <label>
                  Price per kg
                </label>

                <div className="input-with-unit">

                  <span>
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    min="1"
                    required
                  />

                </div>

              </div>



              {/* AVAILABLE UNTIL */}

              <div className="input-group">

                <label>
                  Available Until
                </label>

                <input
                  type="date"
                  name="availableUntil"
                  value={formData.availableUntil}
                  onChange={handleChange}
                  required
                />

              </div>


            </div>



            {/* FORM BUTTONS */}

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={resetForm}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="save-produce-btn"
              >
                {editingId ? "Update Produce" : "Save Produce"}
              </button>

            </div>


          </form>

        </div>

      )}



      {/* PRODUCE LIST */}

      <div className="produce-list-section">


        <div className="section-title">

          <div>

            <h2>
              Your Listed Produce
            </h2>

            <p>
              Produce currently available for buyers.
            </p>

          </div>


          <span>
            {produce.length} items
          </span>

        </div>


        {loading ? (

          <div className="produce-empty-state">
            <p>Loading your produce…</p>
          </div>

        ) : error ? (

          <div className="produce-empty-state">
            <div className="big-produce-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="empty-add-btn" onClick={fetchProduce}>
              Try Again
            </button>
          </div>

        ) : produce.length === 0 ? (

          <div className="produce-empty-state">

            <div className="big-produce-icon">
              🥕
            </div>


            <h2>
              No produce listed yet
            </h2>


            <p>
              Start selling your fresh produce by
              adding your first item.
            </p>


            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="empty-add-btn"
            >
              + Add Your First Produce
            </button>

          </div>

        ) : (

          <div className="produce-list">

            {produce.map((item) => (

              <div
                className="produce-item"
                key={item._id}
              >

                <div className="produce-item-icon">

                  {item.category === "Fruits"
                    ? "🍎"
                    : item.category === "Grains"
                    ? "🌾"
                    : item.category === "Seeds"
                    ? "🌱"
                    : item.category === "Spices"
                    ? "🌶️"
                    : "🥬"}

                </div>



                <div className="produce-item-info">

                  <h3>
                    {item.name}
                  </h3>

                  <span>
                    {item.category}
                  </span>

                </div>



                <div className="produce-detail">

                  <small>
                    Quantity
                  </small>

                  <strong>
                    {item.quantity} kg
                  </strong>

                </div>



                <div className="produce-detail">

                  <small>
                    Price
                  </small>

                  <strong>
                    ₹{item.price}/kg
                  </strong>

                </div>



                <div className="produce-detail">

                  <small>
                    Available Until
                  </small>

                  <strong>
                    {item.availableUntil?.slice(0, 10)}
                  </strong>

                </div>



                <div
                  className="available-badge"
                  style={
                    item.status === "Expired"
                      ? { background: "#fdecea", color: "#c62828" }
                      : isExpiringSoon(item.availableUntil)
                      ? { background: "#fff8e1", color: "#b8860b" }
                      : undefined
                  }
                >
                  ● {item.status === "Expired"
                      ? "Expired"
                      : isExpiringSoon(item.availableUntil)
                      ? "Expiring Soon"
                      : "Available"}
                </div>

                <div className="produce-item-actions" style={{ display: "flex", gap: "8px" }}>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    style={{ color: "#c62828", borderColor: "#f3c6c2" }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>

                </div>


              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

}

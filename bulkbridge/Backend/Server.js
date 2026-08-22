const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const produceRoutes = require("./Routes/ProduceRoutes");
const UserRoutes = require("./Routes/UserRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const contactRoutes = require("./Routes/ContactRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/bulkbridge")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// User Routes
app.use("/api/users", UserRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("BulkBridge Backend is Running");
});

// Start Server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
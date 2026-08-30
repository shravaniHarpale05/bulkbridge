require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const produceRoutes = require("./Routes/ProduceRoutes");
const userRoutes = require("./Routes/UserRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const contactRoutes = require("./Routes/ContactRoutes");
const messageRoutes = require("./Routes/MessageRoutes");
const notificationRoutes = require("./Routes/NotificationRoutes");
const adminRoutes = require("./Routes/AdminRoutes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bulkbridge";
const allowedOrigins = String(process.env.CLIENT_URL || "http://localhost:5173").split(",").map((x) => x.trim()).filter(Boolean);

app.use(cors({ origin: (origin, callback) => { if (!origin || allowedOrigins.includes(origin)) return callback(null, true); callback(new Error("CORS origin not allowed")); } }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.json({ service: "BulkBridge API", status: "running" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "BulkBridge API", timestamp: new Date().toISOString() }));
app.use("/api/users", userRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use((_req, res) => res.status(404).json({ message: "API route not found" }));
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ message: "Unexpected server error" }); });

mongoose.connect(MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`BulkBridge API running on http://localhost:${PORT}`)))
  .catch((error) => { console.error("MongoDB Connection Error:", error); process.exit(1); });

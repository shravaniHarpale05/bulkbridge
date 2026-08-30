const express = require("express");
const mongoose = require("mongoose");
const Order = require("../Models/Order");
const Produce = require("../Models/Produce");
const User = require("../Models/user");
const Notification = require("../Models/Notification");
const { authenticate, authorizeRoles } = require("../Middleware");
const router = express.Router();

const transitions = {
  Pending: { farmer: ["Accepted", "Rejected"], buyer: ["Cancelled"] },
  Accepted: { farmer: ["Processing"], buyer: ["Cancelled"] },
  Processing: { farmer: ["Ready for Pickup"] },
  "Ready for Pickup": { farmer: ["Completed"] },
  Completed: { farmer: [], buyer: [] },
  Cancelled: { farmer: [], buyer: [] },
  Rejected: { farmer: [], buyer: [] }
};
async function notify(userId, title, message, type = "order", link = "") { try { await Notification.create({ userId, title, message, type, link }); } catch (e) { console.error("Notification error", e.message); } }

router.post("/add", authenticate, authorizeRoles("buyer"), async (req, res) => {
  let deducted = false;
  try {
    const { produceId } = req.body;
    const quantity = Number(req.body.quantity);
    if (!mongoose.isValidObjectId(produceId) || !Number.isFinite(quantity) || quantity <= 0) return res.status(400).json({ message: "Produce and a valid quantity are required" });
    const produce = await Produce.findById(produceId);
    if (!produce || !produce.active) return res.status(404).json({ message: "Produce not found or inactive" });
    if (new Date(produce.availableUntil) < new Date() || produce.quantity <= 0) return res.status(400).json({ message: "This produce is no longer available" });
    if (quantity < Number(produce.minimumOrder || 1)) return res.status(400).json({ message: `Minimum order is ${produce.minimumOrder} ${produce.unit}` });

    const buyer = await User.findById(req.user.id); const farmer = await User.findById(produce.farmerId);
    if (!buyer || !farmer) return res.status(401).json({ message: "Account not found" });
    const updatedProduce = await Produce.findOneAndUpdate({ _id: produceId, active: true, quantity: { $gte: quantity } }, { $inc: { quantity: -quantity } }, { new: true });
    if (!updatedProduce) return res.status(409).json({ message: "Stock changed. Please refresh and try again" });
    deducted = true;

    const order = await Order.create({ produceId, farmerId: produce.farmerId, buyerId: buyer._id, buyerName: buyer.name, farmerName: farmer.name, produceName: produce.name, quantity, unit: produce.unit || "kg", price: produce.price, totalAmount: quantity * produce.price });
    await notify(farmer._id, "New bulk order", `${buyer.name} ordered ${quantity} ${produce.unit || "kg"} of ${produce.name}.`, "order", "/orders");
    await notify(buyer._id, "Order placed", `Your order for ${produce.name} was placed successfully.`, "order", "/retailer-orders");
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    if (deducted && req.body.produceId && Number(req.body.quantity) > 0) await Produce.findByIdAndUpdate(req.body.produceId, { $inc: { quantity: Number(req.body.quantity) } }).catch(() => {});
    console.error("ORDER ERROR:", error); res.status(500).json({ message: "Failed to place order" });
  }
});

router.get("/", authenticate, authorizeRoles("farmer", "buyer", "admin"), async (req, res) => {
  try {
    const filter = req.user.role === "farmer" ? { farmerId: req.user.id } : req.user.role === "buyer" ? { buyerId: req.user.id } : {};
    res.json(await Order.find(filter).sort({ orderDate: -1 }));
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to fetch orders" }); }
});

router.get("/farmer/:farmerId", authenticate, authorizeRoles("farmer", "admin"), async (req, res) => {
  if (req.user.role !== "admin" && req.params.farmerId !== req.user.id) return res.status(403).json({ message: "You can only access your own orders" });
  try { res.json(await Order.find({ farmerId: req.params.farmerId }).sort({ orderDate: -1 })); } catch (error) { console.error(error); res.status(500).json({ message: "Failed to fetch orders" }); }
});

router.get("/buyer/:buyerId", authenticate, authorizeRoles("buyer", "admin"), async (req, res) => {
  if (req.user.role !== "admin" && req.params.buyerId !== req.user.id) return res.status(403).json({ message: "You can only access your own orders" });
  try { res.json(await Order.find({ buyerId: req.params.buyerId }).sort({ orderDate: -1 })); } catch (error) { console.error(error); res.status(500).json({ message: "Failed to fetch orders" }); }
});

router.patch("/:id/status", authenticate, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid order id" });
    const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ message: "Order not found" });
    const next = String(req.body.status || "");
    const roleKey = req.user.role === "farmer" ? "farmer" : req.user.role === "buyer" ? "buyer" : null;
    const owns = req.user.role === "admin" || (req.user.role === "farmer" && order.farmerId.toString() === req.user.id) || (req.user.role === "buyer" && order.buyerId.toString() === req.user.id);
    if (!owns) return res.status(403).json({ message: "You are not allowed to update this order" });
    if (req.user.role !== "admin" && !transitions[order.status]?.[roleKey]?.includes(next)) return res.status(400).json({ message: `Cannot change ${order.status} to ${next}` });

    const restoresStock = (next === "Cancelled" || next === "Rejected") && !["Cancelled", "Rejected", "Completed"].includes(order.status);
    order.status = next; const updated = await order.save();
    if (restoresStock) await Produce.findByIdAndUpdate(order.produceId, { $inc: { quantity: order.quantity } });
    const recipient = req.user.role === "farmer" ? order.buyerId : order.farmerId;
    await notify(recipient, `Order ${next}`, `${order.produceName} order is now ${next}.`, "order", req.user.role === "farmer" ? "/retailer-orders" : "/orders");
    res.json({ message: "Order status updated", order: updated });
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to update order status" }); }
});

module.exports = router;

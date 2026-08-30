const express = require("express");
const mongoose = require("mongoose");
const Produce = require("../Models/Produce");
const User = require("../Models/user");
const { authenticate, authorizeRoles } = require("../Middleware");
const router = express.Router();

const categories = ["Vegetables", "Fruits", "Grains", "Seeds", "Spices", "Other"];
function statusOf(item) {
  const expired = item.availableUntil && new Date(item.availableUntil) < new Date();
  return { ...item, status: !item.active ? "Inactive" : expired || Number(item.quantity) <= 0 ? "Expired" : "Available" };
}
function validatePayload(body) {
  const name = String(body.name || "").trim();
  const category = String(body.category || "");
  const quantity = Number(body.quantity);
  const price = Number(body.price);
  const minimumOrder = Number(body.minimumOrder || 1);
  const availableUntil = new Date(body.availableUntil);
  if (!name || !categories.includes(category)) return "Name and valid category are required";
  if (!Number.isFinite(quantity) || quantity < 0) return "Quantity must be 0 or greater";
  if (!Number.isFinite(price) || price <= 0) return "Price must be greater than 0";
  if (!Number.isFinite(minimumOrder) || minimumOrder <= 0) return "Minimum order must be greater than 0";
  if (Number.isFinite(quantity) && minimumOrder > quantity && quantity > 0) return "Minimum order cannot exceed available quantity";
  if (Number.isNaN(availableUntil.getTime()) || availableUntil < new Date(new Date().toDateString())) return "Choose a valid future availability date";
  return null;
}

router.post("/add", authenticate, authorizeRoles("farmer"), async (req, res) => {
  try {
    const error = validatePayload(req.body); if (error) return res.status(400).json({ message: error });
    const farmer = await User.findById(req.user.id); if (!farmer) return res.status(401).json({ message: "Farmer account not found" });
    const produce = await Produce.create({ farmerId: req.user.id, name: req.body.name.trim(), category: req.body.category, description: req.body.description || "", imageUrl: req.body.imageUrl || "", quantity: Number(req.body.quantity), unit: req.body.unit || "kg", minimumOrder: Number(req.body.minimumOrder || 1), price: Number(req.body.price), grade: req.body.grade || "Standard", location: req.body.location || farmer.farmLocation || "", harvestDate: req.body.harvestDate || null, availableUntil: req.body.availableUntil });
    res.status(201).json({ message: "Produce added successfully", produce: statusOf(produce.toObject()) });
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to add produce" }); }
});

router.get("/", authenticate, authorizeRoles("farmer", "buyer", "admin"), async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
    if (req.query.search) filter.name = { $regex: String(req.query.search).trim(), $options: "i" };
    if (req.query.active !== "false") filter.active = true;
    const produces = await Produce.find(filter).populate("farmerId", "name farmName farmLocation").sort({ createdAt: -1 }).lean();
    res.json(produces.map((item) => statusOf({ ...item, farmer: item.farmerId, farmerId: item.farmerId?._id || item.farmerId })).filter((item) => req.user.role === "buyer" ? item.status === "Available" : true));
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to fetch produce" }); }
});

router.get("/farmer/:farmerId", authenticate, authorizeRoles("farmer", "admin"), async (req, res) => {
  if (req.user.role !== "admin" && req.params.farmerId !== req.user.id) return res.status(403).json({ message: "You can only access your own produce" });
  try { const produces = await Produce.find({ farmerId: req.params.farmerId }).sort({ createdAt: -1 }).lean(); res.json(produces.map(statusOf)); }
  catch (error) { console.error(error); res.status(500).json({ message: "Failed to fetch your produce" }); }
});

router.get("/:id", authenticate, authorizeRoles("farmer", "buyer", "admin"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid produce id" });
  try {
    const item = await Produce.findById(req.params.id).populate("farmerId", "name farmName farmLocation mainProduce").lean();
    if (!item) return res.status(404).json({ message: "Produce not found" });
    res.json(statusOf({ ...item, farmer: item.farmerId, farmerId: item.farmerId?._id || item.farmerId }));
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to fetch produce" }); }
});

router.put("/:id", authenticate, authorizeRoles("farmer"), async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid produce id" });
    const existing = await Produce.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Produce not found" });
    if (existing.farmerId.toString() !== req.user.id) return res.status(403).json({ message: "You can only edit your own produce" });
    const error = validatePayload(req.body); if (error) return res.status(400).json({ message: error });
    const allowed = ["name", "category", "description", "imageUrl", "quantity", "unit", "minimumOrder", "price", "grade", "location", "harvestDate", "availableUntil", "active"];
    const update = {}; for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];
    if (update.quantity !== undefined) update.quantity = Number(update.quantity);
    if (update.price !== undefined) update.price = Number(update.price);
    if (update.minimumOrder !== undefined) update.minimumOrder = Number(update.minimumOrder);
    const updated = await Produce.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).lean();
    res.json({ message: "Produce updated successfully", produce: statusOf(updated) });
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to update produce" }); }
});

router.delete("/:id", authenticate, authorizeRoles("farmer", "admin"), async (req, res) => {
  try {
    const item = await Produce.findById(req.params.id); if (!item) return res.status(404).json({ message: "Produce not found" });
    if (req.user.role !== "admin" && item.farmerId.toString() !== req.user.id) return res.status(403).json({ message: "You can only delete your own produce" });
    await item.deleteOne(); res.json({ message: "Produce deleted successfully" });
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to delete produce" }); }
});

module.exports = router;

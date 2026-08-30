const express = require("express");
const mongoose = require("mongoose");
const Notification = require("../Models/Notification");
const { authenticate } = require("../Middleware");
const router = express.Router();
router.get("/", authenticate, async (req, res) => {
  try { const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50); const unread = await Notification.countDocuments({ userId: req.user.id, readAt: null }); res.json({ notifications, unread }); }
  catch (e) { console.error(e); res.status(500).json({ message: "Failed to load notifications" }); }
});
router.patch("/:id/read", authenticate, async (req, res) => {
  try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid notification id" }); const n = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { readAt: new Date() }, { new: true }); if (!n) return res.status(404).json({ message: "Notification not found" }); res.json({ notification: n }); }
  catch (e) { console.error(e); res.status(500).json({ message: "Failed to update notification" }); }
});
router.patch("/read-all", authenticate, async (req, res) => {
  try { await Notification.updateMany({ userId: req.user.id, readAt: null }, { readAt: new Date() }); res.json({ message: "All notifications marked as read" }); }
  catch (e) { console.error(e); res.status(500).json({ message: "Failed to update notifications" }); }
});
module.exports = router;

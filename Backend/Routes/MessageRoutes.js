const express = require("express");
const mongoose = require("mongoose");
const Message = require("../Models/Message");
const User = require("../Models/user");
const Notification = require("../Models/Notification");
const { authenticate, authorizeRoles } = require("../Middleware");
const router = express.Router();

router.get("/conversations", authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ $or: [{ senderId: req.user.id }, { receiverId: req.user.id }] }).sort({ createdAt: -1 }).limit(1000).populate("senderId", "name role").populate("receiverId", "name role");
    const map = new Map();
    for (const msg of messages) {
      const other = msg.senderId._id.toString() === req.user.id ? msg.receiverId : msg.senderId;
      if (!map.has(other._id.toString())) map.set(other._id.toString(), { user: other, lastMessage: msg.text, updatedAt: msg.createdAt, unread: 0 });
    }
    for (const msg of messages) if (msg.receiverId._id.toString() === req.user.id && !msg.readAt) { const id = msg.senderId._id.toString(); if (map.has(id)) map.get(id).unread += 1; }
    res.json([...map.values()]);
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to load conversations" }); }
});

router.get("/thread/:userId", authenticate, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) return res.status(400).json({ message: "Invalid user id" });
    const other = await User.findById(req.params.userId).select("name role farmName businessName"); if (!other) return res.status(404).json({ message: "User not found" });
    const messages = await Message.find({ $or: [{ senderId: req.user.id, receiverId: other._id }, { senderId: other._id, receiverId: req.user.id }] }).sort({ createdAt: 1 });
    await Message.updateMany({ senderId: other._id, receiverId: req.user.id, readAt: null }, { $set: { readAt: new Date() } });
    res.json({ user: other, messages });
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to load conversation" }); }
});

router.post("/send", authenticate, authorizeRoles("farmer", "buyer"), async (req, res) => {
  try {
    const receiverId = String(req.body.receiverId || ""); const text = String(req.body.text || "").trim();
    if (!mongoose.isValidObjectId(receiverId) || !text) return res.status(400).json({ message: "Receiver and message are required" });
    if (receiverId === req.user.id) return res.status(400).json({ message: "You cannot message yourself" });
    const receiver = await User.findById(receiverId).select("name role isActive"); if (!receiver || !receiver.isActive || !["farmer", "buyer"].includes(receiver.role)) return res.status(404).json({ message: "Recipient not available" });
    const message = await Message.create({ senderId: req.user.id, receiverId, text });
    const sender = await User.findById(req.user.id).select("name");
    await Notification.create({ userId: receiverId, title: "New message", message: `${sender.name} sent you a message.`, type: "message", link: `/messages?user=${req.user.id}` });
    res.status(201).json({ message });
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to send message" }); }
});

module.exports = router;

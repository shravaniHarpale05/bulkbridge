const express = require("express");
const Contact = require("../Models/Contact");
const router = express.Router();
router.post("/send", async (req, res) => {
  try {
    const name = String(req.body.name || "").trim(); const email = String(req.body.email || "").trim().toLowerCase(); const subject = String(req.body.subject || "").trim(); const message = String(req.body.message || "").trim();
    if (!name || !email || !subject || !message) return res.status(400).json({ success: false, message: "Please fill all contact fields" });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address" });
    await Contact.create({ name, email, subject, message }); res.status(201).json({ success: true, message: "Message sent successfully!" });
  } catch (error) { console.error(error); res.status(500).json({ success: false, message: "Failed to send message" }); }
});
module.exports = router;

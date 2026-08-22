const express = require("express");
const router = express.Router();

const Contact = require("../Models/Contact");

// Save contact message
router.post("/send", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

module.exports = router;
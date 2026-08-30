const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const PasswordResetToken = require("../Models/PasswordResetToken");
const { authenticate, JWT_SECRET } = require("../Middleware");

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(user) { return jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: "7d" }); }
function publicUser(user) { const data = user.toObject ? user.toObject() : { ...user }; delete data.password; return data; }
function cleanUserInput({ name, phone, email }) { return { name: String(name || "").trim(), phone: String(phone || "").replace(/\s+/g, ""), email: String(email || "").trim().toLowerCase() }; }

router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    const cleaned = cleanUserInput({ name, phone, email });
    if (!cleaned.name || !cleaned.phone || !cleaned.email || !password || !role) return res.status(400).json({ message: "All required fields must be filled" });
    if (!emailPattern.test(cleaned.email)) return res.status(400).json({ message: "Enter a valid email address" });
    if (!/^\d{10}$/.test(cleaned.phone)) return res.status(400).json({ message: "Phone number must contain exactly 10 digits" });
    if (!["farmer", "buyer"].includes(role)) return res.status(400).json({ message: "Invalid user role" });
    if (String(password).length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    if (await User.findOne({ email: cleaned.email })) return res.status(409).json({ message: "Email already registered" });
    const saved = await new User({ ...cleaned, password: await bcrypt.hash(password, 12), role }).save();
    res.status(201).json({ message: "User registered successfully", token: createToken(saved), user: publicUser(saved) });
  } catch (error) { console.error("Registration error:", error); res.status(500).json({ message: "Server error" }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail || !password) return res.status(400).json({ message: "Email and password are required" });
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user || !user.isActive) return res.status(401).json({ message: "Invalid email or password" });
    let match = false;
    if (user.password.startsWith("$2")) match = await bcrypt.compare(password, user.password);
    else if (user.password === password) { match = true; user.password = await bcrypt.hash(password, 12); await user.save(); }
    if (!match) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ message: "Login successful", token: createToken(user), user: publicUser(user) });
  } catch (error) { console.error("Login error:", error); res.status(500).json({ message: "Server error" }); }
});

router.get("/me", authenticate, async (req, res) => {
  try { const user = await User.findById(req.user.id); if (!user || !user.isActive) return res.status(404).json({ message: "User not found" }); res.json({ user: publicUser(user) }); }
  catch (error) { console.error(error); res.status(500).json({ message: "Server error" }); }
});

router.put("/update/:id", authenticate, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) return res.status(403).json({ message: "You can only update your own profile" });
    const fields = ["name", "phone", "farmName", "farmLocation", "mainProduce", "businessName", "businessLocation", "buyingCategory", "avatarUrl"];
    const update = {};
    for (const field of fields) if (req.body[field] !== undefined) update[field] = String(req.body[field]).trim();
    if (update.phone && !/^\d{10}$/.test(update.phone)) return res.status(400).json({ message: "Phone number must contain exactly 10 digits" });
    if (update.name && update.name.length < 2) return res.status(400).json({ message: "Name is too short" });
    const updated = await User.findByIdAndUpdate(req.user.id, update, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated successfully", user: publicUser(updated) });
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to update profile" }); }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!emailPattern.test(email)) return res.status(400).json({ message: "Enter a valid email address" });
    const user = await User.findOne({ email, isActive: true });
    const generic = { message: "If an account exists for this email, a password reset link has been created." };
    if (!user) return res.json(generic);

    await PasswordResetToken.deleteMany({ userId: user._id, usedAt: null });
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${rawToken}`;

    let emailSent = false;
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE) === "true", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
        await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to: user.email, subject: "Reset your BulkBridge password", text: `Use this link within 15 minutes to reset your password: ${resetUrl}`, html: `<p>Reset your BulkBridge password within 15 minutes.</p><p><a href="${resetUrl}">Reset password</a></p>` });
        emailSent = true;
      } catch (mailError) { console.error("Reset email error:", mailError.message); }
    }

    if (!emailSent && process.env.NODE_ENV !== "production" && process.env.DEV_RESET_MODE === "true") {
      return res.json({ ...generic, devResetUrl: resetUrl, devResetToken: rawToken });
    }
    res.json(generic);
  } catch (error) { console.error("Forgot password error:", error); res.status(500).json({ message: "Unable to start password reset" }); }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ message: "Reset token and new password are required" });
    if (String(password).length < 8) return res.status(400).json({ message: "Password must be at least 8 characters" });
    const tokenHash = crypto.createHash("sha256").update(String(token)).digest("hex");
    const reset = await PasswordResetToken.findOne({ tokenHash, usedAt: null, expiresAt: { $gt: new Date() } });
    if (!reset) return res.status(400).json({ message: "This reset link is invalid or has expired" });
    const user = await User.findById(reset.userId).select("+password");
    if (!user || !user.isActive) return res.status(400).json({ message: "Account not available" });
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    reset.usedAt = new Date(); await reset.save();
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) { console.error("Reset password error:", error); res.status(500).json({ message: "Unable to reset password" }); }
});

router.post("/admin/bootstrap", async (req, res) => {
  try {
    if (!process.env.ADMIN_BOOTSTRAP_KEY || req.headers["x-admin-bootstrap-key"] !== process.env.ADMIN_BOOTSTRAP_KEY) return res.status(403).json({ message: "Bootstrap access denied" });
    const { name, email, password, phone } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!name || !emailPattern.test(normalizedEmail) || !/^\d{10}$/.test(String(phone || "")) || String(password || "").length < 8) return res.status(400).json({ message: "Valid name, 10-digit phone, email and 8+ character password are required" });
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: "An account already exists for this email" });
    const user = await new User({ name: String(name).trim(), email: normalizedEmail, phone: String(phone), password: await bcrypt.hash(password, 12), role: "admin" }).save();
    res.status(201).json({ message: "Admin account created", user: publicUser(user) });
  } catch (error) { console.error(error); res.status(500).json({ message: "Failed to create admin" }); }
});

router.get("/:id", authenticate, async (req, res) => {
  if (req.params.id !== req.user.id && req.user.role !== "admin") return res.status(403).json({ message: "You can only access your own profile" });
  try { const user = await User.findById(req.params.id); if (!user) return res.status(404).json({ message: "User not found" }); res.json({ user: publicUser(user) }); }
  catch (error) { console.error(error); res.status(500).json({ message: "Server error" }); }
});

module.exports = router;

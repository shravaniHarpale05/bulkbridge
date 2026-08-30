const jwt = require("jsonwebtoken");
const User = require("./Models/user");
const JWT_SECRET = process.env.JWT_SECRET || "bulkbridge-development-secret-change-me";
function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch (_e) { return res.status(401).json({ message: "Invalid or expired authentication token" }); }
}
function authorizeRoles(...roles) { return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ message: "You are not authorized to perform this action" }); }
async function attachUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user || !user.isActive) return res.status(401).json({ message: "User account is unavailable" });
    req.currentUser = user; next();
  } catch (_e) { return res.status(500).json({ message: "Failed to verify user account" }); }
}
module.exports = { authenticate, authorizeRoles, attachUser, JWT_SECRET };

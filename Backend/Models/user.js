const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  phone: { type: String, required: true, trim: true, match: /^\d{10}$/ },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["farmer", "buyer", "admin"], required: true },
  farmName: { type: String, default: "", trim: true, maxlength: 120 },
  farmLocation: { type: String, default: "", trim: true, maxlength: 150 },
  mainProduce: { type: String, default: "", trim: true, maxlength: 120 },
  businessName: { type: String, default: "", trim: true, maxlength: 120 },
  businessLocation: { type: String, default: "", trim: true, maxlength: 150 },
  buyingCategory: { type: String, default: "", trim: true, maxlength: 120 },
  avatarUrl: { type: String, default: "" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
schema.set("toJSON", { transform: (_doc, ret) => { delete ret.password; return ret; } });
module.exports = mongoose.model("User", schema);

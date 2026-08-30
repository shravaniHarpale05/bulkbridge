const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, enum: ["Vegetables", "Fruits", "Grains", "Seeds", "Spices", "Other"] },
  description: { type: String, default: "", trim: true, maxlength: 1000 },
  imageUrl: { type: String, default: "" },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, enum: ["kg", "quintal", "tonne", "piece", "bag"], default: "kg" },
  minimumOrder: { type: Number, default: 1, min: 1 },
  price: { type: Number, required: true, min: 0 },
  grade: { type: String, default: "Standard", trim: true, maxlength: 50 },
  location: { type: String, default: "", trim: true, maxlength: 120 },
  harvestDate: { type: Date, default: null },
  availableUntil: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });
schema.index({ category: 1, active: 1, availableUntil: 1 });
schema.index({ farmerId: 1, createdAt: -1 });
module.exports = mongoose.model("Produce", schema);

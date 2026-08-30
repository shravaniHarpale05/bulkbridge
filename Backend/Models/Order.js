const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  produceId: { type: mongoose.Schema.Types.ObjectId, ref: "Produce", required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  buyerName: { type: String, required: true },
  farmerName: { type: String, default: "" },
  produceName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: "kg" },
  price: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["Pending", "Accepted", "Processing", "Ready for Pickup", "Completed", "Cancelled", "Rejected"], default: "Pending", index: true },
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model("Order", schema);

const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  text: { type: String, required: true, trim: true, maxlength: 2000 },
  readAt: { type: Date, default: null }
}, { timestamps: true });
schema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
module.exports = mongoose.model("Message", schema);

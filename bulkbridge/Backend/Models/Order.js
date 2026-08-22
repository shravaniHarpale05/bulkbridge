const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  produceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produce"
  },

  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  buyerName: {
    type: String,
    required: true
  },

  farmerName: {
    type: String
  },

  produceName: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  },

  orderDate: {
    type: Date,
    default: Date.now
  }

});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

const express = require("express");
const Order = require("../Models/Order");
const Produce = require("../Models/Produce");

const router = express.Router();

// ===============================
// PLACE ORDER
// ===============================

router.post("/add", async (req, res) => {

  try {

    const {
      produceId,
      farmerId,
      buyerId,
      buyerName,
      farmerName,
      produceName,
      quantity,
      price,
      totalAmount
    } = req.body;

    // If a produceId was supplied, make sure enough stock is available
    if (produceId) {

      const produce = await Produce.findById(produceId);

      if (!produce) {
        return res.status(404).json({ message: "Produce not found" });
      }

      if (new Date(produce.availableUntil) < new Date(new Date().toDateString())) {
        return res.status(400).json({ message: "This produce is no longer available" });
      }

      if (Number(quantity) > produce.quantity) {
        return res.status(400).json({ message: "Requested quantity exceeds available stock" });
      }

      produce.quantity -= Number(quantity);
      await produce.save();

    }

    const newOrder = new Order({
      produceId,
      farmerId,
      buyerId,
      buyerName,
      farmerName,
      produceName,
      quantity,
      price,
      totalAmount
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });

  } catch (error) {

    console.log("ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message
    });

  }

});

// ===============================
// GET ALL ORDERS
// ===============================

router.get("/", async (req, res) => {

  try {

    const orders = await Order.find().sort({ orderDate: -1 });

    res.status(200).json(orders);

  } catch (error) {

    console.log("FETCH ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });

  }

});

// ===============================
// GET ORDERS FOR A FARMER (received)
// ===============================

router.get("/farmer/:farmerId", async (req, res) => {

  try {

    const orders = await Order.find({ farmerId: req.params.farmerId }).sort({ orderDate: -1 });

    res.status(200).json(orders);

  } catch (error) {

    console.log("FETCH FARMER ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });

  }

});

// ===============================
// GET ORDERS FOR A BUYER (placed)
// ===============================

router.get("/buyer/:buyerId", async (req, res) => {

  try {

    const orders = await Order.find({ buyerId: req.params.buyerId }).sort({ orderDate: -1 });

    res.status(200).json(orders);

  } catch (error) {

    console.log("FETCH BUYER ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message
    });

  }

});

// ===============================
// UPDATE ORDER STATUS
// ===============================

router.patch("/:id/status", async (req, res) => {

  try {

    const { status } = req.body;

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      order: updated
    });

  } catch (error) {

    console.log("UPDATE ORDER STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message
    });

  }

});

module.exports = router;

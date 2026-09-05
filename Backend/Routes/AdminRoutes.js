const express = require("express");

const User = require("../Models/user");
const Produce = require("../Models/Produce");
const Order = require("../Models/Order");
const Contact = require("../Models/Contact");

const { authenticate, authorizeRoles } = require("../Middleware");

const router = express.Router();

router.use(authenticate, authorizeRoles("admin"));


router.get("/stats", async (_req, res) => {
  try {
    const [
      farmers,
      buyers,
      products,
      orders,
      completed,
      contacts
    ] = await Promise.all([
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "buyer" }),
      Produce.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "Completed" }),
      Contact.countDocuments()
    ]);

    const revenue = await Order.aggregate([
      {
        $match: {
          status: "Completed"
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$totalAmount"
          }
        }
      }
    ]);

    res.json({
      farmers,
      buyers,
      products,
      orders,
      completed,
      contacts,
      revenue: revenue[0]?.total || 0
    });

  } catch (e) {
    console.error(e);

    res.status(500).json({
      message: "Failed to load admin statistics"
    });
  }
});


// Get Users
router.get("/users", async (_req, res) => {
  try {
    res.json(
      await User.find()
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(200)
    );

  } catch (e) {
    res.status(500).json({
      message: "Failed to load users"
    });
  }
});


// Update User Status
router.patch("/users/:id/status", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: Boolean(req.body.isActive)
      },
      {
        new: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user
    });

  } catch (e) {
    res.status(500).json({
      message: "Failed to update user"
    });
  }
});


// Get Orders
router.get("/orders", async (_req, res) => {
  try {
    res.json(
      await Order.find()
        .sort({ orderDate: -1 })
        .limit(200)
    );

  } catch (e) {
    res.status(500).json({
      message: "Failed to load orders"
    });
  }
});


// Get Contact Messages
router.get("/contacts", async (_req, res) => {
  try {
    res.json(
      await Contact.find()
        .sort({ createdAt: -1 })
        .limit(200)
    );

  } catch (e) {
    res.status(500).json({
      message: "Failed to load contact messages"
    });
  }
});


module.exports = router;
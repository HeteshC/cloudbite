const express = require("express");
const router = express.Router();

const {
  addOrder,
  orderUpload,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/OrderController");

// Add a new order (accepts multiple food images if needed)
router.post(
  "/order/add",
  orderUpload.fields([{ name: "food_images", maxCount: 10 }]),
  addOrder
);

// Get all orders
router.get("/order/all-orders", getAllOrders);

// Get a single order by ID
router.get("/order/:id", getOrderById);

// Update an order by ID (accepts multiple food images if needed)
router.put(
  "/order/update-order/:id",
  orderUpload.fields([{ name: "food_images", maxCount: 10 }]),
  updateOrder
);

// Delete an order by ID
router.delete("/order/delete-order/:id", deleteOrder);

// Fetch orders for a specific user
const Order = require("../models/OrderModel");
router.get("/orders/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("foods.food")
      .sort({ bookingDate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const Vendor = require("../models/VendorModel");
const Outlet = require("../models/OutletModel");
const Food = require("../models/FoodModel");

// Multer setup for food images in order (if needed)
const orderStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/order_food_images";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const orderUpload = multer({ storage: orderStorage });

// Add a new order
const addOrder = async (req, res) => {
  try {
    const {
      user,
      foods,
      vendor,
      outlet,
      bookingDate,
      status,
      notes,
      email,
      paymentMethod,
      paymentStatus,
      cardDetails,
      address, // Accept address object
    } = req.body;

    // Parse foods if it's a string
    let parsedFoods = [];
    if (typeof foods === "string") {
      parsedFoods = JSON.parse(foods);
    } else if (Array.isArray(foods)) {
      parsedFoods = foods;
    } else if (typeof foods === "object" && foods) {
      parsedFoods = [foods];
    }

    // Attach uploaded images to foods if any (optional)
    if (req.files && req.files.food_images) {
      req.files.food_images.forEach((file, idx) => {
        if (parsedFoods[idx]) {
          parsedFoods[idx].food_image = file.path;
        }
      });
    }

    // Validate user
    const userDoc = await User.findById(user);
    if (!userDoc) return res.status(400).json({ message: "Invalid user" });

    // Validate foods
    for (const foodObj of parsedFoods) {
      if (foodObj.food) {
        const foodDoc = await Food.findById(foodObj.food);
        if (!foodDoc) return res.status(400).json({ message: `Invalid food: ${foodObj.food}` });
      }
    }

    // Optional: Validate vendor and outlet
    if (vendor) {
      const vendorDoc = await Vendor.findById(vendor);
      if (!vendorDoc) return res.status(400).json({ message: "Invalid vendor" });
    }
    if (outlet) {
      const outletDoc = await Outlet.findById(outlet);
      if (!outletDoc) return res.status(400).json({ message: "Invalid outlet" });
    }

    // Prepare cardDetails if paymentMethod is card
    let cardDetailsObj = undefined;
    if (paymentMethod === "card" && cardDetails) {
      cardDetailsObj = {
        cardNumber: cardDetails.cardNumber,
        cardName: cardDetails.cardName,
        cardExpiry: cardDetails.cardExpiry,
        cardCVV: cardDetails.cardCVV,
      };
    }

    const newOrder = new Order({
      user,
      email,
      foods: parsedFoods,
      vendor: vendor || undefined,
      outlet: outlet || undefined,
      bookingDate: bookingDate ? new Date(bookingDate) : undefined,
      status,
      notes,
      paymentMethod,
      paymentStatus,
      cardDetails: cardDetailsObj,
      address: address || {}, // Save address object
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// Fetch all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("foods.food")
      .populate("vendor")
      .populate("outlet");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// Fetch single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("user")
      .populate("foods.food")
      .populate("vendor")
      .populate("outlet");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// Update order by ID
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // If foods is a stringified array, parse it
    if (typeof updateFields.foods === "string") {
      updateFields.foods = JSON.parse(updateFields.foods);
    }

    // Attach uploaded images to foods if any
    if (req.files && req.files.food_images && updateFields.foods) {
      req.files.food_images.forEach((file, idx) => {
        if (updateFields.foods[idx]) {
          updateFields.foods[idx].food_image = file.path;
        }
      });
    }

    updateFields.updatedAt = Date.now();

    const updatedOrder = await Order.findByIdAndUpdate(id, updateFields, { new: true })
      .populate("user")
      .populate("foods.food")
      .populate("vendor")
      .populate("outlet");

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};

// Delete order by ID
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    // Optionally, remove food images from disk
    if (deletedOrder.foods && deletedOrder.foods.length > 0) {
      deletedOrder.foods.forEach((foodObj) => {
        if (foodObj.food_image && fs.existsSync(foodObj.food_image)) {
          fs.unlinkSync(foodObj.food_image);
        }
      });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};

module.exports = {
  addOrder,
  orderUpload,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
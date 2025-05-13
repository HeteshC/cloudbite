const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Link to Product collection
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Link to User
    required: true,
  },
  items: {
    type: [cartItemSchema], // Array of cart items
    default: [], // Default to an empty array
  },
});

module.exports = mongoose.model("Cart", cartSchema);

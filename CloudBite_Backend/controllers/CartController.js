const Cart = require("../models/CartModel");
const Food = require("../models/FoodModel"); // Updated to reference Food model

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.food"
    );

    if (!cart) {
      console.warn(`No cart found for user ID: ${req.user.id}`);
      return res.status(200).json({ items: [] }); // Return empty cart if none exists
    }

    // Filter out items with null food references
    const validItems = cart.items.filter((item) => item.food !== null);

    // If there are invalid items, clean up the cart
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
      console.warn(`Cleaned up invalid cart items for user ID: ${req.user.id}`);
    }

    const formattedItems = validItems.map((item) => ({
      _id: item.food._id,
      product_name: item.food.product_name,
      selling_price: item.food.selling_price,
      display_price: item.food.display_price,
      product_image: item.food.product_image,
      availability_status: item.food.availability_status,
      quantity: item.quantity,
    }));

    res.json({ items: formattedItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    console.log("Received foodId:", foodId); // Log the foodId for debugging

    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required." });
    }

    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0." });
    }

    // Check if the food exists in the database
    const food = await Food.findById(foodId);
    if (!food) {
      console.error("Food not found for foodId:", foodId); // Log the missing food
      return res.status(404).json({ message: "Food not found." });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (existingItem) {
      existingItem.quantity += quantity; // Increment quantity
    } else {
      cart.items.push({ food: foodId, quantity }); // Add new item
    }

    await cart.save();

    // Fetch the updated cart with populated food details
    const updatedCart = await Cart.findOne({ user: req.user.id }).populate(
      "items.food"
    );

    const formattedItems = updatedCart.items.map((item) => ({
      _id: item.food._id,
      product_name: item.food.product_name,
      selling_price: item.food.selling_price,
      display_price: item.food.display_price,
      product_image: item.food.product_image,
      availability_status: item.food.availability_status,
      quantity: item.quantity,
    }));

    res.status(200).json({ message: "Item added to cart.", items: formattedItems });
  } catch (error) {
    console.error("Error in addToCart:", error); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Cart Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.food.toString() === foodId
    );
    if (!item) return res.status(404).json({ message: "Food not in cart" });

    item.quantity = quantity;

    await cart.save();
    res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Remove Item from Cart
exports.removeCartItem = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId
    );

    await cart.save();
    res.status(200).json({ message: "Item removed" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Sync Guest Cart to Server
exports.syncCart = async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    cart.items = items.map((item) => ({
      food: item._id,
      quantity: item.quantity,
    }));

    await cart.save();
    res.status(200).json({ message: "Cart synchronized" });
  } catch (error) {
    console.error("Cart sync error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

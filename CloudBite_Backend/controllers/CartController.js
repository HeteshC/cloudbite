const Cart = require("../models/CartModel");

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart) {
      console.warn(`No cart found for user ID: ${req.user.id}`);
      return res.status(200).json({ items: [] }); // Return empty cart if none exists
    }

    const formattedItems = cart.items.map((item) => {
      if (!item.product) {
        console.error(`Product not found for cart item: ${item}`);
        return null; // Skip items with missing product references
      }

      return {
        _id: item.product._id,
        product_name: item.product.product_name,
        selling_price: item.product.selling_price,
        display_price: item.product.display_price,
        product_image: item.product.product_image,
        availability_status: item.product.availability_status,
        quantity: item.quantity,
      };
    }).filter(Boolean); // Remove null items

    res.json({ items: formattedItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    if (quantity === undefined || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0." });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity; // Increment quantity
    } else {
      cart.items.push({ product: productId, quantity }); // Add new item
    }

    await cart.save();

    // Fetch the updated cart with populated product details
    const updatedCart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    const formattedItems = updatedCart.items.map((item) => ({
      _id: item.product._id,
      product_name: item.product.product_name,
      selling_price: item.product.selling_price,
      display_price: item.product.display_price,
      product_image: item.product.product_image,
      availability_status: item.product.availability_status,
      quantity: item.quantity,
    }));

    res.status(200).json({ message: "Item added to cart.", items: formattedItems });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Cart Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) return res.status(404).json({ message: "Product not in cart" });

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
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
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
      product: item._id,
      quantity: item.quantity,
    }));

    await cart.save();
    res.status(200).json({ message: "Cart synchronized" });
  } catch (error) {
    console.error("Cart sync error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

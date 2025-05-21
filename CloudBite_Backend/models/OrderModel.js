const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // Reference to the user who made the order
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // User email
  email: {
    type: String,
    required: true,
  },

  // Array of foods ordered (with food image and quantity)
  foods: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
      food_image: { type: String },
      quantity: { type: Number, default: 1 },
    },
  ],

  // Optional: Vendor reference (if enabled for foods)
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: false,
  },

  // Optional: Outlet reference (if enabled for foods)
  outlet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Outlet",
    required: false,
  },

  // Booking date and time
  bookingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  // Status of the food order
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "returned",
    ],
    default: "pending",
  },

  // Payment status
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },

  // Additional notes or instructions
  notes: {
    type: String,
  },

  // Timestamps for creation and update
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Payment method
  paymentMethod: {
    type: String,
    enum: ["cod", "card"],
    required: true,
  },

  // Card payment details (only if paymentMethod is "card")
  cardDetails: {
    cardNumber: { type: String },
    cardName: { type: String },
    cardExpiry: { type: String }, // MM/YYYY or MM/YY
    cardCVV: { type: String },
  },

  // User address details
  address: {
    addressLine1: { type: String }, // This is not used in most places, but keep for compatibility
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String }, // Should match frontend "pinCode"
    country: { type: String },
    phone: { type: String },
  },

  // Total price for the order
  totalAmount: { type: Number, default: 0 },
});

// Calculate totalAmount using populated food prices before saving
orderSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  if (Array.isArray(this.foods) && this.foods.length > 0) {
    let total = 0;
    for (const item of this.foods) {
      let price = 0;
      // If food is populated (object), use its selling_price
      if (
        item.food &&
        typeof item.food === "object" &&
        item.food.selling_price
      ) {
        price = item.food.selling_price;
      } else if (item.food) {
        // If not populated, fetch from DB
        const Food = mongoose.model("Food");
        const foodDoc = await Food.findById(item.food).select("selling_price");
        price = foodDoc ? foodDoc.selling_price : 0;
      }
      total += price * (item.quantity || 1);
    }
    this.totalAmount = total;
  } else {
    this.totalAmount = 0;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
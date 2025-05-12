const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  product_name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, trim: true }, // Ensure slug is unique and trimmed
  product_image: { type: String, required: false },
  description: { type: String, required: true },
  sku: { type: String, required: true, unique: true, trim: true }, // Required field
  display_price: { type: Number },
  selling_price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: false,
  },
  stock: { type: Number, required: true }, // Required field
  total_products_sold: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  avg_rating: { type: Number, default: 0 },
  total_reviews: { type: Number, default: 0 },
  tags: [{ type: String }],
  section_to_appear: {
    type: [String],
    default: ["all_products"],
    enum: [
      "all_products",
      "top_deals",
      "new_arrivals",
      "featured",
      "trending",
      "most_viewed",
      "recommended",
      "home_banner",
      "limited_time_offers",
    ],
  },
  featured: { type: Boolean, default: false },
  is_new_arrival: { type: Boolean, default: false },
  is_trending: { type: Boolean, default: false },
  availability_status: { type: Boolean, default: true },
  discount: { type: Number, default: 0 },
  min_purchase_qty: { type: Number, default: 1 },
  max_purchase_qty: { type: Number, default: 100 },
  delivery_time_estimate: { type: String },
  replacement_policy: { type: String },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
    default: "6809f7f0ed9f36edb58306c5",
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  returns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Return" }],
  wishlist_users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  questions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      question: String,
      answer: String,
      answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      answeredAt: Date,
    },
  ],
  related_products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Food" }],
  bundles: [
    {
      items: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
          quantity: Number,
        },
      ],
      bundle_price: Number,
    },
  ],
  vector_embedding: { type: [Number] },
  popularity_score: { type: Number, default: 0 },
  meta_title: { type: String },
  meta_description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  isDeleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 },
  admin_notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  kitchen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Kitchen", // Ensure this matches the Kitchen model name
    required: true,
  },
});

foodSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

foodSchema.index({
  product_name: "text",
  tags: "text",
  meta_title: "text",
  meta_description: "text",
});
foodSchema.index({ category: 1 });
foodSchema.index({ vendor: 1 });

foodSchema.methods.isLinkedToUser = function (userId) {
  const userInWishlist = this.wishlist_users.some(
    (user) => user.toString() === userId.toString()
  );
  const userInOrders = this.orders.some(
    (order) => order.user && order.user.toString() === userId.toString()
  );
  const userInPurchases = this.purchases.some(
    (user) => user.toString() === userId.toString()
  );
  return userInWishlist || userInOrders || userInPurchases;
};

// Check if the model already exists before defining it
const Food = mongoose.models.Food || mongoose.model("Food", foodSchema);
module.exports = Food;
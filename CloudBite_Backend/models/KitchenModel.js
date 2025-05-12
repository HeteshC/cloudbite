const mongoose = require('mongoose');

const KitchenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contact_number: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'under_maintenance'],
    default: 'active'
  },
  operating_hours: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    required: false
  },
  rating: {
    type: Number,
    default: 0
  },
  total_orders: {
    type: Number,
    default: 0
  },
    total_reviews: {
    type: Number,
    default: 0
  },
    
  
  questions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      question: { type: String, required: true },
      answer: { type: String },
      answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
      answeredAt: { type: Date }
    }
  ],
  related_kitchens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Kitchen" }],
  popularity_score: { type: Number, default: 0 },
  meta_title: { type: String },
  meta_description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  isDeleted: { type: Boolean, default: false },
  created_at: {
    type: Date,
    default: Date.now
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

KitchenSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Kitchen', KitchenSchema);

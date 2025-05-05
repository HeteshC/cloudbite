const Food = require("../models/foodModel");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Add new food item
const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!req.file) {
      console.log("No image file uploaded.");
      return res.status(400).json({ message: "Image file is required." });
    }

    const image = req.file.filename;

    if (!name || !description || !price || !category) {
      console.log("Missing required fields.");
      return res.status(400).json({ message: "All fields are required." });
    }

    const newFood = new Food({
      name,
      description,
      price,
      image,
      category,
    });

    await newFood.save();
    console.log("Food item added successfully!");
    res.status(201).json({ message: "Food item added successfully!", food: newFood });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all food items
const listFood = async (req, res) => {
  try {
    const foods = await Food.find();
    console.log("Fetched all food items.");
    res.status(200).json({ message: "Food items fetched successfully!", data: foods });
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFood = await Food.findByIdAndDelete(id); // ✅ Fixed here
    if (!deletedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ message: "Failed to delete food item" });
  }
};

module.exports = {
  addFood,
  upload,
  listFood,
  removeFood,
};

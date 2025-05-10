const Food = require("../models/FoodModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const foodUploadDir = path.join("uploads", "food_images");

if (!fs.existsSync(foodUploadDir)) {
  fs.mkdirSync(foodUploadDir, { recursive: true });
}

const foodStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, foodUploadDir);
  },
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

const foodUpload = multer({ storage: foodStorage });
exports.foodUpload = foodUpload;

exports.addFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      stock,
      sku,
      kitchen,
    } = req.body;

    const product_image = req.file?.path.replace(/\\/g, "/") || "";

    // Validate required fields
    if (!name || !description || !price || !stock || !sku || !kitchen) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newFood = new Food({
      product_name: name,
      description,
      selling_price: price,
      category,
      subcategory,
      stock,
      sku,
      kitchen,
      product_image,
    });

    const savedFood = await newFood.save();
    res.status(201).json({ message: "Food item added successfully!", food: savedFood });
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({ message: "Failed to add food item.", error });
  }
};

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ isDeleted: false })
      .populate("category")
      .populate("subcategory")
      .populate("vendor");
    res.status(200).json(foods);
  } catch (error) {
    console.error("Get All Foods Error:", error);
    res.status(500).json({ message: "Failed to fetch foods." });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("category")
      .populate("subcategory")
      .populate("vendor");

    if (!food || food.isDeleted) {
      return res.status(404).json({ message: "Food not found." });
    }

    res.status(200).json(food);
  } catch (error) {
    console.error("Get Food By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch food." });
  }
};

exports.updateFoodById = async (req, res) => {
  try {
    const updatedFields = { ...req.body };

    if (req.files) {
      if (req.files["product_image"] && req.files["product_image"][0]) {
        updatedFields.product_image = req.files[
          "product_image"
        ][0].path.replace(/\\/g, "/");
      }

      if (req.files["all_product_images"]) {
        updatedFields.all_product_images = req.files["all_product_images"].map(
          (file) => file.path.replace(/\\/g, "/")
        );
      }
    }

    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found." });
    }

    res.status(200).json(updatedFood);
  } catch (error) {
    console.error("Update Food Error:", error);
    res.status(500).json({ message: "Failed to update food." });
  }
};

exports.deleteFoodById = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );

    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found." });
    }

    res.status(200).json({ message: "Food deleted." });
  } catch (error) {
    console.error("Delete Food Error:", error);
    res.status(500).json({ message: "Failed to delete food." });
  }
};

exports.searchFoods = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const foods = await Food.find({
      isDeleted: false,
      $or: [
        { product_name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { meta_title: { $regex: query, $options: "i" } },
        { meta_description: { $regex: query, $options: "i" } },
      ],
    }).populate("category subcategory vendor");

    res.status(200).json(foods);
  } catch (error) {
    console.error("Search Foods Error:", error);
    res.status(500).json({ message: "Failed to search foods." });
  }
};


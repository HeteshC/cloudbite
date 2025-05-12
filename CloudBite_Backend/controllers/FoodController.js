const Food = require("../models/FoodModel");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // Import UUID for unique slug generation

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
      display_price,
      selling_price,
      category,
      subcategory,
      stock,
      sku,
      kitchen,
      discount, // Optional discount provided by superadmin
    } = req.body;

    const product_image = req.file?.path.replace(/\\/g, "/") || "";

    // Generate a unique slug if not provided
    const slug = name
      ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + uuidv4()
      : uuidv4(); // Ensure slug is always generated

    // Calculate discount if not provided
    const calculatedDiscount =
      display_price > selling_price
        ? `${Math.round(((display_price - selling_price) / display_price) * 100)}% OFF`
        : "0% OFF";

    const finalDiscount = discount || calculatedDiscount;

    const newFood = new Food({
      product_name: name,
      description,
      display_price: display_price || selling_price,
      selling_price,
      category,
      subcategory,
      stock,
      sku,
      kitchen,
      product_image,
      slug, // Ensure slug is always set
      discount: finalDiscount, // Store the discount
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
    const { kitchen, subcategory } = req.query; // Extract kitchen and subcategory from query params
    const filter = { isDeleted: false };

    if (kitchen) {
      filter.kitchen = kitchen; // Add kitchen filter if provided
    }

    if (subcategory) {
      filter.subcategory = subcategory; // Add subcategory filter if provided
    }

    const foods = await Food.find(filter)
      .populate({
        path: "kitchen",
        select: "name", // Only select the kitchen name
      })
      .populate({
        path: "subcategory",
        select: "subcategory_name", // Only select the subcategory name
      })
      .populate("category");

    // Dynamically calculate discount if not already set
    const updatedFoods = foods.map((food) => {
      if (!food.discount || food.discount === "0% OFF") {
        const calculatedDiscount =
          food.display_price > food.selling_price
            ? `${Math.round(((food.display_price - food.selling_price) / food.display_price) * 100)}% OFF`
            : "0% OFF";
        food.discount = calculatedDiscount;
      }
      return food;
    });

    res.status(200).json(updatedFoods);
  } catch (error) {
    console.error("Get All Foods Error:", error);
    res.status(500).json({ message: "Failed to fetch foods.", error });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("category")
      .populate("subcategory")
      .populate("vendor")
      .populate("kitchen"); // Populate kitchen field

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


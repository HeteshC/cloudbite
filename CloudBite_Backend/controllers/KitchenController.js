const Kitchen = require("../models/KitchenModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const kitchenUploadDir = path.join("uploads", "kitchens");

if (!fs.existsSync(kitchenUploadDir)) {
  fs.mkdirSync(kitchenUploadDir, { recursive: true });
}

const kitchenStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, kitchenUploadDir);
  },
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const kitchenUpload = multer({ storage: kitchenStorage });
exports.kitchenUpload = kitchenUpload;

exports.createKitchen = async (req, res) => {
  try {
    const {
      name,
      location,
      contact_number,
      email,
      status,
      operating_hours,
      tags,
      createdBy,
    } = req.body;

    // Validate createdBy field
    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ message: "Invalid or missing createdBy field." });
    }

    const image = req.file ? req.file.path.replace(/\\/g, "/") : "";

    const newKitchen = new Kitchen({
      name,
      location,
      contact_number,
      email,
      status,
      operating_hours,
      tags,
      image,
      createdBy,
    });

    const savedKitchen = await newKitchen.save();
    res.status(201).json(savedKitchen);
  } catch (error) {
    console.error("Create Kitchen Error:", error);
    res.status(500).json({ message: "Failed to create kitchen." });
  }
};

exports.getAllKitchens = async (req, res) => {
  try {
    const kitchens = await Kitchen.find({ isDeleted: false });
    res.status(200).json(kitchens);
  } catch (error) {
    console.error("Get All Kitchens Error:", error);
    res.status(500).json({ message: "Failed to fetch kitchens." });
  }
};

exports.getKitchenById = async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.id).populate("related_kitchens");

    if (!kitchen || kitchen.isDeleted) {
      return res.status(404).json({ message: "Kitchen not found." });
    }

    res.status(200).json(kitchen);
  } catch (error) {
    console.error("Get Kitchen By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch kitchen." });
  }
};

exports.updateKitchenById = async (req, res) => {
  try {
    const {
      name,
      location,
      contact_number,
      email,
      status,
      operating_hours,
      tags,
      updatedBy,
    } = req.body;

    const updatedFields = {
      name,
      location,
      contact_number,
      email,
      status,
      operating_hours,
      tags,
      updatedBy,
      updatedAt: Date.now(),
    };

    if (req.file) {
      updatedFields.image = req.file.path.replace(/\\/g, "/");
    }

    const updatedKitchen = await Kitchen.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedKitchen) {
      return res.status(404).json({ message: "Kitchen not found." });
    }

    res.status(200).json(updatedKitchen);
  } catch (error) {
    console.error("Update Kitchen Error:", error);
    res.status(500).json({ message: "Failed to update kitchen." });
  }
};

exports.deleteKitchenById = async (req, res) => {
  try {
    const deletedKitchen = await Kitchen.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );

    if (!deletedKitchen) {
      return res.status(404).json({ message: "Kitchen not found." });
    }

    res.status(200).json({ message: "Kitchen deleted." });
  } catch (error) {
    console.error("Delete Kitchen Error:", error);
    res.status(500).json({ message: "Failed to delete kitchen." });
  }
};

exports.searchKitchens = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const kitchens = await Kitchen.find({
      isDeleted: false,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { meta_title: { $regex: query, $options: "i" } },
        { meta_description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(kitchens);
  } catch (error) {
    console.error("Search Kitchens Error:", error);
    res.status(500).json({ message: "Failed to search kitchens." });
  }
};

exports.countAllKitchens = async (req, res) => {
  try {
    const count = await Kitchen.countDocuments({ isDeleted: false });
    res.status(200).json({ count });
  } catch (error) {
    console.error("Count Kitchens Error:", error);
    res.status(500).json({ message: "Failed to count kitchens." });
  }
};

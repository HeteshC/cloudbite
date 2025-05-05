const express = require("express");
const router = express.Router();

const {
  addFood,
  upload,
  listFood,
  removeFood,
} = require("../controllers/FoodController");

// Route to add a food item with image upload
router.post("/add", upload.single("image"), addFood);

// Route to list all food items
router.get("/list", listFood);

// Route to remove a food item
router.delete("/remove/:id", removeFood);

module.exports = router;

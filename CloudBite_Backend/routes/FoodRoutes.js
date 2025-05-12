const express = require("express");
const router = express.Router();
const {
  foodUpload,
  addFood,
  getAllFoods,
  getFoodById,
  updateFoodById,
  deleteFoodById,
  searchFoods,
} = require("../controllers/FoodController");

// Routes
router.post(
  "/add-food",
  foodUpload.single("image"), // Ensure 'image' matches the frontend field name
  addFood
);
router.get("/all-foods", getAllFoods); // Ensure this route is correctly mapped
router.get("/get-food-by-id/:id", getFoodById);
router.put(
  "/update-food/:id",
  foodUpload.fields([
    { name: "product_image", maxCount: 1 },
    { name: "all_product_images", maxCount: 10 },
  ]),
  updateFoodById
);
router.delete("/delete-food/:id", deleteFoodById);
router.get("/search-foods", searchFoods);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/SubCategoryController");
const { subCategoryUpload } = controller;

// ========== CREATE ==========
router.post(
  "/add-sub-category",
  subCategoryUpload.single("image"),
  controller.addSubCategory
);

// ========== READ ==========
router.get("/all-subcategories", controller.getAllSubCategories);
router.get("/get-subcategory-by-id/:id", controller.getSubCategoryById);

// ========== UPDATE ==========
router.put(
  "/update-subcategory/:id",
  subCategoryUpload.single("image"),
  controller.updateSubCategory
);

// ========== DELETE ==========
router.delete("/delete-subcategory/:id", controller.deleteSubCategory);

// ========== COUNTS ==========
router.get("/count-all-subcategories", controller.countAllSubCategories);
router.get("/count-active-subcategories", controller.countActiveSubCategories);
router.get("/count-subcategories-by-category", controller.countSubCategoriesPerCategory);

module.exports = router;

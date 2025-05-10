const express = require("express");
const router = express.Router();
const KitchenController = require("../controllers/KitchenController");
const { kitchenUpload } = KitchenController;

// ========== CREATE ==========
router.post(
  "/add-kitchen",
  kitchenUpload.single("image"),
  KitchenController.createKitchen
);

// ========== READ ==========
router.get("/all-kitchens", KitchenController.getAllKitchens);
router.get("/get-kitchen-by-id/:id", KitchenController.getKitchenById);
router.get("/search-kitchens", KitchenController.searchKitchens);

// ========== UPDATE ==========
router.put(
  "/update-kitchen/:id",
  kitchenUpload.single("image"),
  KitchenController.updateKitchenById
);

// ========== DELETE ==========
router.delete("/delete-kitchen/:id", KitchenController.deleteKitchenById);

// ========== COUNTS ==========
router.get("/count-all-kitchens", KitchenController.countAllKitchens);

module.exports = router;

const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, adminOnly, upload.single("image"), createProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, adminOnly, upload.single("image"), updateProduct)
  .delete(protect, adminOnly, deleteProduct);
router.post("/:id/review", protect, addReview);

module.exports = router;

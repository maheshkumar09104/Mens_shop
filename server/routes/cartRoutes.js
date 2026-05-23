const express = require("express");
const {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getMyCart).post(protect, addToCart).delete(protect, clearCart);
router.route("/:productId").put(protect, updateCartItem).delete(protect, removeCartItem);

module.exports = router;

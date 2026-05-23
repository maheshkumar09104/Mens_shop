const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, adminOnly, getAllOrders);
router.get("/myorders", protect, getMyOrders);
router.put("/:id/deliver", protect, adminOnly, updateOrderToDelivered);

module.exports = router;

const Order = require("../models/Order");

const createOrder = async (req, res) => {
  const { orderItems, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalPrice
  });

  return res.status(201).json(order);
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  return res.json(orders);
};

const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.isDelivered = true;
  const updatedOrder = await order.save();
  return res.json(updatedOrder);
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderToDelivered
};

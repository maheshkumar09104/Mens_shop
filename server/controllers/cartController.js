const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getMyCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("cartItems.product");
  return res.json(cart || { user: req.user._id, cartItems: [] });
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: []
    });
  }

  const existingItem = cart.cartItems.find((item) => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.cartItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: Number(quantity)
    });
  }

  const updatedCart = await cart.save();
  return res.status(201).json(updatedCart);
};

const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const cartItem = cart.cartItems.find((item) => item.product.toString() === req.params.productId);

  if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  cartItem.quantity = Number(quantity);
  const updatedCart = await cart.save();
  return res.json(updatedCart);
};

const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.cartItems = cart.cartItems.filter((item) => item.product.toString() !== req.params.productId);
  const updatedCart = await cart.save();
  return res.json(updatedCart);
};

const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.json({ user: req.user._id, cartItems: [] });
  }

  cart.cartItems = [];
  const updatedCart = await cart.save();
  return res.json(updatedCart);
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};

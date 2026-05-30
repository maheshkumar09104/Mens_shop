const Product = require("../models/Product");

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500";

const getUploadedImageUrl = (req) => {
  if (!req.file) {
    return null;
  }

  return req.file.path;
};

const getProductPayload = (req) => {
  const { name, description, price, category, stock, imageUrl } = req.body;
  const payload = {
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock)
  };
  const image = getUploadedImageUrl(req);

  if (image) {
    payload.image = image;
  } else if (imageUrl) {
    payload.image = imageUrl;
  } else if (!req.params.id) {
    payload.image = DEFAULT_PRODUCT_IMAGE;
  }

  return payload;
};

const getAllProducts = async (req, res) => {
  const { category, search, sort } = req.query;
  const filter = {};
  const sortOptions = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  if (sort === "price_asc" || sort === "price") {
    sortOptions.price = 1;
  } else if (sort === "price_desc" || sort === "-price") {
    sortOptions.price = -1;
  } else {
    sortOptions.createdAt = -1;
  }

  const products = await Product.find(filter).sort(sortOptions);
  return res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
};

const createProduct = async (req, res) => {
  const product = await Product.create(getProductPayload(req));
  return res.status(201).json(product);
};

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, getProductPayload(req), {
    new: true,
    runValidators: true
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.json({ message: "Product removed" });
};

const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admins cannot review products" });
  }

  const alreadyReviewed = product.reviews.some((review) => review.user.toString() === req.user._id.toString());

  if (alreadyReviewed) {
    return res.status(400).json({ message: "Product already reviewed" });
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  });

  product.numReviews = product.reviews.length;
  product.avgRating =
    product.reviews.reduce((total, review) => total + review.rating, 0) / product.reviews.length;
  product.ratings = product.avgRating;

  const updatedProduct = await product.save();
  return res.status(201).json(updatedProduct);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
};

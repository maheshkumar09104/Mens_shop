const Product = require("../models/Product");

const getUploadedImageUrl = (req) => {
  if (!req.file) {
    return null;
  }

  return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
};

const getProductPayload = (req) => {
  const { name, description, price, category, stock } = req.body;
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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};

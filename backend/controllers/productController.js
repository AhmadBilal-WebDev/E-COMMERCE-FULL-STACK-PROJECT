const Product = require("../models/productModel");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const product = await Product.create({ name, price, description, image });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to add product", error: err });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product", error: err });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to get product", error: err });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image } = req.body;
    const updated = await Product.findByIdAndUpdate(
      id,
      { name, price, description, image },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product", error: err });
  }
};

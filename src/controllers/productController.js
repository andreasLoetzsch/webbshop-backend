const Product = require("../models/productModels");

const createProduct = async (req, res) => {
  const { title, price, details, category, brand, images } = req.body;
  try {
    const titleAlreadyInUse = await Product.findOne({
      title: { $regex: "^" + title + "$", $options: "i" },
    });

    if (titleAlreadyInUse) {
      return res
        .status(400)
        .json({ success: false, message: "Title already in use" });
    }

    const product = await new Product({
      title: title,
      price: price,
      details: details,
      category: category,
      brand: brand,
      images: images,
    });
    await product.save();
    res.status(200).json({ success: true, message: "Product added" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;
  try {
    await Product.findByIdAndUpdate(id, {
      price: price,
    });
    res
      .status(200)
      .json({ success: true, message: "Product successfully updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOneProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const product = await Product.find();
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getOneProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};

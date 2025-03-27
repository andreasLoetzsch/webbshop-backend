const mongoose = require("mongoose");

const productModel = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  details: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String },
    },
  ],
});

module.exports = mongoose.model("product", productModel);

const express = require("express");
const router = express.Router();
const {
  createProduct,
  getOneProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/create", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getOneProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

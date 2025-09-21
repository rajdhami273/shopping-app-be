const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controller");

// middleware
const { authenticateToken } = require("../../../middlewares/auth.middleware");

router.get("/", getProducts);
router.post("/", authenticateToken, createProduct);
router.delete("/:id", authenticateToken, deleteProduct);
router.put("/:id", authenticateToken, updateProduct);

module.exports = router;

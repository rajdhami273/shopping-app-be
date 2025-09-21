const express = require("express");
const router = express.Router();
const {
  getCart,
  addProductToCart,
  updateProductInCart,
  removeProductFromCart,
} = require("../controllers/cart.controller");

router.get("/", getCart);
router.post("/add-product/", addProductToCart);
router.post("/update-product/:id", updateProductInCart);
router.post("/remove-product/:id", removeProductFromCart);

module.exports = router;

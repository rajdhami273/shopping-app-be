const express = require("express");
const router = express.Router();

// routes
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const brandRoutes = require("./brand.routes");
const categoryRoutes = require("./category.routes");
const productRoutes = require("./product.routes");
const reviewRoutes = require("./review.routes");
const addressRoutes = require("./address.routes");
const cartRoutes = require("./cart.routes");

// middleware
const { authenticateToken } = require("../../../middlewares/auth.middleware");

router.use("/auth", authRoutes);
router.use("/user", authenticateToken, userRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/review", reviewRoutes);
router.use("/address", authenticateToken, addressRoutes);
router.use("/cart", authenticateToken, cartRoutes);

module.exports = router;

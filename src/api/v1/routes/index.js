const express = require("express");
const router = express.Router();

// routes
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

// middleware
const { authenticateToken } = require("../../../middlewares/auth.middleware");

router.use("/auth", authRoutes);
router.use("/user", authenticateToken, userRoutes);

module.exports = router;

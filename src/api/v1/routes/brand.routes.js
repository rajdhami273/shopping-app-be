const express = require("express");
const router = express.Router();
const {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand.controller");

// middleware
const { authenticateToken } = require("../../../middlewares/auth.middleware");

router.get("/", getBrands);
router.post("/", authenticateToken, createBrand);
router.put("/:id", authenticateToken, updateBrand);
router.delete("/:id", authenticateToken, deleteBrand);

module.exports = router;

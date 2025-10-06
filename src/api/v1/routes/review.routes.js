const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  deleteReview,
  getReviewsByProduct
} = require("../controllers/review.controller");

// middleware
const { authenticateToken } = require("../../../middlewares/auth.middleware");
const { uploadMultiple, handleUploadError } = require("../../../middlewares/upload.middleware");

router.get("/", getReviews);
router.post("/", authenticateToken, uploadMultiple, handleUploadError, createReview);
router.delete("/:id", authenticateToken, deleteReview);
router.get("/product/:id", getReviewsByProduct);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/review.controller");

// middleware
const { authenticateToken } = require("../../../middlewares/auth.middleware");

router.get("/", getReviews);
router.post("/", authenticateToken, createReview);
router.delete("/:id", authenticateToken, deleteReview);

module.exports = router;

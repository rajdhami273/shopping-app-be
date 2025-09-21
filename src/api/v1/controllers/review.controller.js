const Review = require("../models/Review.model");

async function createReview(req, res) {
  try {
    const { product, rating, review, assets } = req.body;
    const user = req.user._id;
    const reviewData = await Review.create({
      product,
      rating,
      review,
      assets,
      user,
    });
    res
      .status(201)
      .json({ data: reviewData, message: "Review created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function getReviews(req, res) {
  try {
    const reviews = await Review.find();
    res
      .status(200)
      .json({ data: reviews, message: "Reviews fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    const currentUser = req.user._id;
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.createdBy.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Review.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Review deleted successfully", data: review });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

module.exports = { createReview, getReviews, deleteReview };

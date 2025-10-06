const Review = require("../models/Review.model");

async function createReview(req, res) {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    const { product, rating, review } = req.body;
    const user = req.user._id;

    // Process uploaded images
    let assets = [];
    if (req.files && req.files.length > 0) {
      assets = req.files.map((file) => ({
        mediaType: file.mimetype,
        mediaUrl: `/uploads/${file.filename}`, // Store relative path to the uploaded file
      }));
    }

    const reviewData = await Review.create({
      product,
      rating: parseInt(rating),
      review,
      assets,
      user,
    });

    // Populate user data for response
    const populatedReview = await Review.findById(reviewData._id).populate(
      "user",
      "name"
    );

    res
      .status(201)
      .json({ data: populatedReview, message: "Review created successfully" });
  } catch (error) {
    console.error("Error creating review:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function getReviews(req, res) {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("product", "name");
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
    if (review.user.toString() !== currentUser.toString()) {
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

async function getReviewsByProduct(req, res) {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ product: id })
      .populate("user", "name")
      .sort({ createdAt: -1 }); // Sort by newest first
    res
      .status(200)
      .json({ data: reviews, message: "Reviews fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

module.exports = {
  createReview,
  getReviews,
  deleteReview,
  getReviewsByProduct,
};

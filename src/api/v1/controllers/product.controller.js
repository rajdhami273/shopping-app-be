const mongoose = require("mongoose");
const Product = require("../models/Product.model");

async function createProduct(req, res) {
  try {
    const {
      name,
      description,
      price,
      currency,
      category,
      brand,
      stock,
      assets,
    } = req.body;
    const createdBy = req.user._id;
    const product = await Product.create({
      name,
      description,
      price,
      currency,
      category,
      brand,
      stock,
      assets,
      createdBy,
    });
    res
      .status(201)
      .json({ data: product, message: "Product created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function getProducts(req, res) {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          currency: 1,
          category: 1,
          brand: 1,
          stock: 1,
          assets: 1,
          createdBy: 1,
          reviewCount: { $size: "$reviews" },
          rating: { $round: [{ $avg: "$reviews.rating" }, 1] },
        },
      },
    ]);
    res
      .status(200)
      .json({ data: products, message: "Products fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const currentUser = req.user._id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.createdBy.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Product deleted successfully", data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      currency,
      category,
      brand,
      stock,
      assets,
    } = req.body;
    const currentUser = req.user._id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.createdBy.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        currency,
        category,
        brand,
        stock,
        assets,
        createdBy: currentUser,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "product",
          as: "reviews",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          currency: 1,
          category: 1,
          brand: 1,
          stock: 1,
          assets: 1,
          createdBy: 1,
          reviewCount: { $size: "$reviews" },
          rating: { $round: [{ $avg: "$reviews.rating" }, 1] },
        },
      },
    ]);
    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ data: product[0], message: "Product fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}
module.exports = {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getProduct,
};

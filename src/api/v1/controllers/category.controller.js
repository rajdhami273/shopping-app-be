const Category = require("../models/Category.model");

async function createCategory(req, res) {
  try {
    const { name, relevantTo } = req.body;
    const createdBy = req.user._id;
    const category = await Category.create({ name, relevantTo, createdBy });
    res
      .status(201)
      .json({ data: category, message: "Category created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({ data: categories, message: "Categories fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const currentUser = req.user._id;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (category.createdBy.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Category.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Category deleted successfully", data: category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, relevantTo } = req.body;
    const currentUser = req.user._id;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (category.createdBy.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, relevantTo },
      { new: true }
    );
    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};

const Brand = require("../models/Brand.model");

async function createBrand(req, res) {
  try {
    const { name, logoUrl, description, websiteUrl, email, phoneNumber } =
      req.body;
    const createdBy = req.user._id;
    const brand = await Brand.create({
      name,
      logoUrl,
      description,
      websiteUrl,
      email,
      phoneNumber,
      createdBy,
    });
    res
      .status(201)
      .json({ data: brand, message: "Brand created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function getBrands(req, res) {
  try {
    const brands = await Brand.find();
    res
      .status(200)
      .json({ data: brands, message: "Brands fetched successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function deleteBrand(req, res) {
  try {
    const { id } = req.params;
    const currentUser = req.user._id;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    if (brand.createdBy.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Brand.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Brand deleted successfully", data: brand });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function updateBrand(req, res) {
  try {
    const { id } = req.params;
    const { name, logoUrl, description, websiteUrl, email, phoneNumber } =
      req.body;
    const currentUser = req.user._id;
    const brand = await Brand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    if (brand.createdBy.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      {
        name,
        logoUrl,
        description,
        websiteUrl,
        email,
        phoneNumber,
        createdBy: currentUser,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Brand updated successfully", data: updatedBrand });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

module.exports = { createBrand, getBrands, deleteBrand, updateBrand };

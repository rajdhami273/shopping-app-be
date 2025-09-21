const Address = require("../models/Address.model");

async function createAddress(req, res) {
  try {
    const {
      address,
      city,
      state,
      country,
      postalCode,
      mobileNumber,
      name,
      addressType,
    } = req.body;
    const addressData = await Address.create({
      user: req.user._id,
      address,
      city,
      state,
      country,
      postalCode,
      mobileNumber,
      name,
      addressType,
    });
    return res
      .status(201)
      .json({ message: "Address created successfully", data: addressData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}
async function getAddresses(req, res) {
  try {
    const addresses = await Address.find({ user: req.user._id });
    return res
      .status(200)
      .json({ message: "Addresses fetched successfully", data: addresses });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}
async function deleteAddress(req, res) {
  try {
    const { id } = req.params;
    const currentUser = req.user._id;
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    if (address.user.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Address.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "Address deleted successfully", data: address });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

async function updateAddress(req, res) {
  try {
    const { id } = req.params;
    const { address, city, state, country, postalCode, mobileNumber, name } =
      req.body;
    const currentUser = req.user._id;
    const addressData = await Address.findById(id);
    if (!addressData) {
      return res.status(404).json({ message: "Address not found" });
    }
    if (addressData.user.toString() !== currentUser.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        address,
        city,
        state,
        country,
        postalCode,
        mobileNumber,
        name,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Address updated successfully", data: updatedAddress });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
}

module.exports = { createAddress, getAddresses, deleteAddress, updateAddress };

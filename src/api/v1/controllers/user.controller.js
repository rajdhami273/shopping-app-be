const User = require("../models/User.model");

async function getUser(req, res) {
  return res
    .status(200)
    .json({ message: "User fetched successfully", data: req.user });
}

async function getUsers(req, res) {
  try {
    // add filter and pagination
    const users = await User.find();
    return res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.user._id;
    const { name, email, password, countryCode, mobileNumber, dob, gender } =
      req.body;
    const user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password,
      countryCode,
      mobileNumber,
      dob,
      gender,
    });
    return res
      .status(200)
      .json({ message: "User updated successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

module.exports = { getUser, getUsers, updateUser };

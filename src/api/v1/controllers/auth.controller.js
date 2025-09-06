const {
  validatePassword,
  validateEmail,
} = require("../../../utils/validation");
const { hashPassword, comparePassword } = require("../../../utils/password");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../../../utils/token");

const User = require("../models/User.model");
const RefreshToken = require("../models/RefreshToken.model");

async function register(req, res) {
  try {
    const { email, password, name, countryCode, mobileNumber, dob, gender } =
      req.body;
    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ message: emailError.message });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError.message });
    }
    const userAlreadyExists = await User.findOne({ email: RegExp(email, "i") });
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = hashPassword(password);
    const user = await new User({
      email,
      passwordHash: hashedPassword,
      name,
      countryCode,
      mobileNumber,
      dob,
      gender,
    }).save();

    // send verification email

    // send verification code

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    await new RefreshToken({
      token: refreshToken,
      userId: user._id,
    }).save();
    return res.status(201).json({
      message: "User created successfully",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;
    // find otp doc with email and otp and then delete it
    const otpDoc = await Otp.findOne({ email, otp });
    // check if otpDoc is expired
    if (otpDoc.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    // delete otpDoc
    await otpDoc.deleteOne();
    // now resend a new otp
    // generate new otp doc with new otp and email
    const newOtpDoc = await new Otp({
      email,
      otp: newOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    }).save();

    // update user activeStatus to true
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: RegExp(email, "i") });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = comparePassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    await new RefreshToken({
      token: refreshToken,
      userId: user._id,
    }).save();
    return res
      .status(200)
      .json({ message: "Login successful", data: { accessToken, user } });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.cookies;
    await RefreshToken.findOneAndDelete({ token: refreshToken });
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(404).json({ message: "Refresh token not found" });
    }
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }
    const user = await User.findById(decoded.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const accessToken = generateAccessToken(user._id);
    return res
      .status(200)
      .json({ message: "Access token refreshed", data: { accessToken } });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { register, login, logout, refreshAccessToken };

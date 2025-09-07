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
const { generateOTP } = require("../../../utils/otp");

const User = require("../models/User.model");
const RefreshToken = require("../models/RefreshToken.model");
const Otp = require("../models/Otp.model");

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

    // generate otp
    const otp = generateOTP();
    await new Otp({
      email,
      otp,
      expiresAt: Date.now() + 3 * 60 * 1000,
    }).save();
    console.log(otp);

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
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function verifyEmail(req, res) {
  try {
    const { email, otp } = req.body;
    // find otp doc with email and otp and then delete it
    const otpDoc = await Otp.findOne({ email, otp });
    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    // check if otpDoc is expired
    if (otpDoc.expiresAt < Date.now()) {
      // now resend a new otp
      // generate new otp doc with new otp and email
      const newOtp = generateOTP();
      await otpDoc
        .updateOne({
          otp: newOtp,
          expiresAt: Date.now() + 3 * 60 * 1000,
        })
        .save();
      console.log(newOtp);
      return res.status(400).json({ message: "OTP expired, new OTP sent." });
    }
    // delete otpDoc
    await otpDoc.deleteOne();
    await User.updateOne(
      { email: RegExp(email, "i") },
      {
        $set: {
          activeStatus: {
            isActive: true,
            inactiveReason: "",
            inactiveCode: "",
            inactiveDate: "",
            activeDate: new Date(),
          },
        },
      }
    );
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

async function disableAccount(req, res) {
  try {
    const { userId } = req.params;
    const { inactiveReason, inactiveCode } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      activeStatus: {
        isActive: false,
        inactiveReason,
        inactiveCode,
        inactiveDate: new Date(),
        activeDate: null,
      },
    });
    return res
      .status(200)
      .json({ message: "Account disabled successfully", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteAccount(req, res) {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function resetPassword(req, res) {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;
    const isOldPasswordMatching = comparePassword(
      oldPassword,
      user.passwordHash
    );
    if (!isOldPasswordMatching) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      return res.status(400).json({ message: newPasswordError.message });
    }
    const hashedNewPassword = hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { passwordHash: hashedNewPassword });
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  verifyEmail,
  disableAccount,
  deleteAccount,
  resetPassword,
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjhiZDFmZDU2MTBmNTJlYTE2YmQ3YWU3IiwiaWF0IjoxNzU3MjI0OTE3LCJleHAiOjE3NTcyMzIxMTd9.bthsNxhLlXVgYA9N89cpavxaPCyAVtUV8mYOKdg1WQs

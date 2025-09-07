const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshAccessToken,
  disableAccount,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth.controller");

const { authenticateToken } = require("../../../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh-access-token", refreshAccessToken);
router.put("/disable-account/:userId", disableAccount);
router.put("/reset-password", authenticateToken, resetPassword);
router.post("/verify-email", verifyEmail);

module.exports = router;

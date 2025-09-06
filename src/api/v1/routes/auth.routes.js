const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshAccessToken,
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-access-token", refreshAccessToken);

module.exports = router;

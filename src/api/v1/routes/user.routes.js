const express = require("express");
const router = express.Router();

// controllers
const {
  getUser,
  getUsers,
  updateUser,
} = require("../controllers/user.controller");

// middleware
const { authorizeRole } = require("../../../middlewares/role.middleware");

router.get("/", authorizeRole("admin"), getUsers);
router.get("/me", getUser);
router.put("/me", updateUser);

module.exports = router;

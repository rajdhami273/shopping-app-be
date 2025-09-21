const express = require("express");
const router = express.Router();
const {
  createAddress,
  getAddresses,
  deleteAddress,
  updateAddress,
} = require("../controllers/address.controller");

router.post("/", createAddress);
router.get("/", getAddresses);
router.delete("/:id", deleteAddress);
router.put("/:id", updateAddress);

module.exports = router;

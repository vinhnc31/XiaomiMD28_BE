const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
router.get("/address/:AccountId", addressController.getAccountId);
router.post("/address", addressController.createAddress);
router.put("/address/:id", addressController.updateAddress);
router.delete("/address/:id", addressController.deleteAddress);
module.exports = router;

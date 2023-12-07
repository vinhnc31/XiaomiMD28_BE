const express = require("express");
const router = express.Router();
const cloudinary = require("../middleWare/cloudinary.middlewere");
const staffController = require("../controllers/staff.controller");

router.get("/staff", staffController.getStaff);
router.post("/staff", cloudinary.single("image"), staffController.createStaff);
router.put(
  "/staff/:id",
  cloudinary.single("image"),
  staffController.updateStaff
);
router.post("/loginWeb", staffController.loginWeb);
router.delete("/staff/:id", staffController.deleteStaff);

module.exports = router;

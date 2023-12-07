const express = require("express");
const router = express.Router();
const cloudinary = require("../middleWare/cloudinary.middlewere");
const staffController = require("../controllers/staff.controller");

router.get("/staff", staffController.getStaff);
router.post("/staff", cloudinary.single("avatar"), staffController.createStaff);
router.post(
  "/staffUpdate/:id",
  cloudinary.single("avatar"),
  staffController.updateStaff
); 
router.post("/staff/:id", staffController.deleteStaff);
router.get("/updateStaff/:id", staffController.viewUpdateStaff);
router.post("/search", staffController.searchStaff);
router.post("/loginWeb", staffController.loginWeb);
router.delete("/staff/:id", staffController.deleteStaff);

module.exports = router;

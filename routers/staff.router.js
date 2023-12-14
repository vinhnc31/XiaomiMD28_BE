const express = require("express");
const router = express.Router();
const cloudinary = require("../middleWare/cloudinary.middlewere");
const staffController = require("../controllers/staff.controller");
const middleWare = require("../middleWare/auth.middlewere");

router.get("/staff", middleWare.loggedin, staffController.getStaff);
router.post("/staff", cloudinary.single("avatar"), staffController.createStaff);
router.post(
  "/staffUpdate/:id",
  cloudinary.single("avatar"),
  staffController.updateStaff
); 
router.post("/staff/:id", staffController.deleteStaff);
router.get("/updateStaff/:id", middleWare.loggedin, staffController.viewUpdateStaff);
router.post("/searchStaff", staffController.searchStaff);
router.post("/loginWeb", staffController.loginWeb);
router.post("/staff/:id", staffController.deleteStaff); 
router.get("/form-addStaff", middleWare.loggedin, staffController.addStaffView);
module.exports = router;

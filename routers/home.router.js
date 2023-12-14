const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");
const middleWare = require("../middleWare/auth.middlewere");
router.get("/", middleWare.loggedin, homeController.getAllData);
router.get("/OrderInMonth", homeController.getOrderInMonth);
router.get("/RevenueInMonth", homeController.getRevenueInMonth);
module.exports = router;

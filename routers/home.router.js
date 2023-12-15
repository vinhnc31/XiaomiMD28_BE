const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.controller");
const middleWare = require("../middleWare/auth.middlewere");
router.get("/", middleWare.loggedin, homeController.getAllData);
router.get("/OrderInMonth",  middleWare.loggedin, homeController.getOrderInMonth);
router.get("/RevenueInMonth",  middleWare.loggedin, homeController.getRevenueInMonth);
module.exports = router;

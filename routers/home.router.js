const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home.Controller");
const middleWare = require("../middleWare/auth.middlewere");
router.get("/totalAccount", homeController.getAccount);
router.get("/totalProduct", homeController.getProduct);
router.get("/totalOrder", homeController.getOrder);
router.get("/totalStaff", homeController.getStaff);
router.get("/Order", homeController.getOrderNew);
router.get("/AccountNew", homeController.getAccountNew);
router.get("/",  homeController.getAllData);
router.get("/OrderInMonth", homeController.getOrderInMonth);
router.get("/RevenueInMonth", homeController.getRevenueInMonth);
module.exports = router;

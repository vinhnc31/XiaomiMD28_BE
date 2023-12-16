const express = require("express");
const router = express.Router();
const middleWare = require("../middleWare/auth.middlewere");

const statisticalController = require("../controllers/statistical.controller");
router.get("/all", middleWare.loggedin, statisticalController.getAll);
router.get("/RevenueInMonth",  middleWare.loggedin, statisticalController.getRevenueInMonth);
router.get("/chartProductSel", middleWare.loggedin, statisticalController.getChartProductSel);
module.exports = router;

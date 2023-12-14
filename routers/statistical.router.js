const express = require("express");
const router = express.Router();
const middleWare = require("../middleWare/auth.middlewere");

const statisticalController = require("../controllers/statistical.controller");
router.get("/all", middleWare.loggedin, statisticalController.getAll);
router.get("/RevenueInMonth", statisticalController.getRevenueInMonth);
router.get("/chartProductSel", statisticalController.getChartProductSel);
module.exports = router;

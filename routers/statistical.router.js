const express = require("express");
const router = express.Router();
const statisticalController = require("../controllers/statistical.controller");
router.get("/all", statisticalController.getAll);
router.get("/RevenueInMonth", statisticalController.getRevenueInMonth);
router.get("/chartProductSel", statisticalController.getChartProductSel);
module.exports = router;

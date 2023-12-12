const express = require("express");
const router = express.Router();
const statisticalController = require("../controllers/statistical.controller");
router.get("/totalProduct", statisticalController.getProduct);
router.get("/totalOrder", statisticalController.getOrder);
router.get("/totalStaff", statisticalController.getStaff);
router.get("/totalRevenue", statisticalController.getRevenue);
router.get("/orderCancellation", statisticalController.getOrderCancellation);
router.get("/prohibitedStaff", statisticalController.getProhibitedStaff);
router.get("/productSel", statisticalController.getProductSelling);
router.get(
  "/ProductIsOutOfStock",
  statisticalController.getProductIsOutOfStock
);
router.get(
  "/all",
  statisticalController.getAll
);
// router.get("/staffNew", statisticalController.getStaffNew);
router.get("/orderNew", statisticalController.getOrderNew);
router.get("/RevenueInMonth", statisticalController.getRevenueInMonth);
router.get("/chartProductSel", statisticalController.getChartProductSel);
module.exports = router;

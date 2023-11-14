const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
router.get("/order", orderController.getListOrder);
router.post("/order", orderController.createOrder);
router.put("/order/:id", orderController.updateOrder);

module.exports = router;

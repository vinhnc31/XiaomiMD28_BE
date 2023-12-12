const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMidleWare = require("../middleWare/auth.middlewere");

router.get("/order", orderController.getListOrder);
router.get(
  "/order/listOrder",
  authMidleWare.apiAuth,
  orderController.getListOrderInAccountAndStatus
);
router.post("/order", authMidleWare.apiAuth, orderController.createOrder);
router.put("/order/:id", authMidleWare.apiAuth, orderController.updateOrder);
router.put(
  "/order/statusOrder/:id",
  authMidleWare.apiAuth,
  orderController.updateStatusOrders
);
module.exports = router;

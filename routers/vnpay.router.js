const express = require("express");
const router = express.Router();

const vnPayController = require("../controllers/vnpay.controller");

router.post("/create_payment_url", vnPayController.createVnPay);
router.get("/vnpay_return", vnPayController.getVnPayReturn);
router.get("/vnpay_ipn", vnPayController.getVnPayInput);
module.exports = router;

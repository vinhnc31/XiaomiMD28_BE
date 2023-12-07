const express = require("express");
const routers = express.Router();
const voucher = require("../controllers/voucherView.controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");
routers.get("/voucher", voucher.getData);
routers.get("/voucher/add", voucher.indexaddPromotion);
routers.post(
  "/voucher/add",
  cloudinary.single("image"),
  voucher.createPromotion
);
routers.post("/voucher/delete/:id", voucher.deletePromotion);
module.exports = routers;

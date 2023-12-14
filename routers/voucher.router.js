const express = require("express");
const routers = express.Router();
const voucher = require("../controllers/voucherView.controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");
const middleWare = require("../middleWare/auth.middlewere");
routers.get("/voucher", middleWare.loggedin, voucher.getData);
routers.get("/voucher/add", middleWare.loggedin, voucher.indexaddPromotion);
routers.post(
  "/voucher/add",
  cloudinary.single("image"),
  voucher.createPromotion
);
routers.post("/voucher/delete/:id", voucher.deletePromotion);
module.exports = routers;

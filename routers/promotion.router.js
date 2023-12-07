const express = require("express");
const routers = express.Router();
const promotionController = require("../controllers/promorion.controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");
routers.get("/promotion", promotionController.getData);
routers.post(
  "/promotion",
  cloudinary.single("image"),
  promotionController.createPromotion
);
routers.put(
  "/promotion/:id",
  cloudinary.single("image"),
  promotionController.updatePromotion
);
routers.delete("/promotion/:id", promotionController.deletePromotion);
module.exports = routers;

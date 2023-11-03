const express = require("express");
const router = express.Router();
const productColorController = require("../controllers/product_color.controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");
router.post(
  "/product_color",
  cloudinary.single("image"),
  productColorController.createProductColor
);
router.delete("/product_color/:id", productColorController.deleteProductColor);

module.exports = router;

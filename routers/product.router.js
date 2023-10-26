const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");

router.get("/product", productController.getProduct);
router.get("/product/:CategoryId",productController.getProductID);
router.post(
  "/product",
  cloudinary.single("image"),
  productController.addCategory
);
router.delete("/product/:id", productController.deleteProduct);
module.exports = router;

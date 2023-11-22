const express = require("express");
const routers = express.Router();
const productColorConfigController = require("../controllers/productcolor_config.controller");
routers.post(
  "/product_color_config",
  productColorConfigController.createProductColorConfig
);
routers.delete(
  "/product_color_config/:id",
  productColorConfigController.deleteProductColorConfig
);
module.exports = routers;

const expess = require("express");
const router = expess.Router();

const productController = require("../controllers/productView.Controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");
const middleWare = require("../middleWare/auth.middlewere");

router.get("/category/:id", productController.indexProductCategory);
router.get("/", middleWare.loggedin, productController.index);
router.get("/add", middleWare.loggedin, productController.indexAddProduct);
router.post("/delete/:id", productController.deleteProduct);
router.post("/add", cloudinary.single("images"), productController.addProduct);
router.get(
  "/update/:id",
  middleWare.loggedin,
  productController.indexUpdateProduct
);
router.post(
  "/update/:id",
  cloudinary.single("images"),
  productController.updateProduct
);
router.post("/addCategory", productController.addCategory);
router.post("/deleteCategory", productController.deleteCategory);
router.post("/delete/color/:id", productController.deleteColor);
router.post("/delete/config/:id", productController.deleteConfig);

router.get(
  "/add/colorProduct/:id",
  middleWare.loggedin,
  productController.indexColorProduct
);
router.post("/add/color/:id", productController.addColor);
router.post(
  "/add/colorProduct/:id",
  cloudinary.single("images"),
  productController.addProductColor
);
router.post(
  "/add/colorProduct/delete/:id/:productColorId",
  productController.deleteProductColor
);

router.get(
  "/add/colorProduct_config/:id",
  middleWare.loggedin,
  productController.indexConfigProductColor
);
router.post("/add/config/:id", productController.addConfig);
router.post(
  "/add/colorProduct_config/:id",
  productController.addConfigProductColor
);
router.post(
  "/add/colorProduct_config/delete/:id/:productColor_configId",
  productController.deleteProductColor_config
);

module.exports = router;

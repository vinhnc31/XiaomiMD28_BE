const expess = require("express");
const router = expess.Router();

const productController = require("../controllers/productView.Controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");

router.get("/", productController.index);
router.get("/add", productController.indexAddProduct);
router.post("/delete/:id", productController.deleteProduct);
router.post("/add", cloudinary.single("images"), productController.addProduct);
router.get("/update/:id", productController.indexUpdateProduct);
router.post(
  "/update/:id",
  cloudinary.single("image"),
  productController.updateProduct
);
router.post("/addCategory", productController.addCategory);

router.get("/add/colorProduct/:id", productController.indexColorProduct);
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

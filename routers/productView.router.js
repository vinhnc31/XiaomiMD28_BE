const expess = require("express");
const router = expess.Router();

const productController = require("../controllers/productView.Controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");

router.get("/", productController.index);
router.get("/add", productController.indexAddProduct);
router.post("/delete/:id", productController.deleteProduct);
router.post("/add", cloudinary.single("image"), productController.addProduct);
router.get("/update/:id", productController.indexUpdateProduct);
router.post(
  "/update/:id",
  cloudinary.single("image"),
  productController.updateProduct
);
router.post("/addCategory", productController.addCategory);
router.get("/add/colorProduct/:id", productController.indexColorProduct);
router.post("/add/color", productController.addColor);
router.post(
  "/add/colorProduct/:id",
  cloudinary.single("image"),
  productController.addProductColor
);
router.get("/aa", productController.color);

module.exports = router;

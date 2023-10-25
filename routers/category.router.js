const expess = require("express");
const router = expess.Router();
const categoryController = require("../controllers/category.controlles");
const cloudinary = require("../middleWare/cloudinary.middlewere");

router.get("/category", categoryController.getCategory);
router.get("/category/:id", categoryController.getCategoryId);
router.post(
  "/category",
  cloudinary.single("image"),
  categoryController.createCategory
);
router.put(
  "/category/:id",
  cloudinary.single("image"),
  categoryController.updateCategory
);
router.delete("/category/:id", categoryController.deleteCategory);
module.exports = router;

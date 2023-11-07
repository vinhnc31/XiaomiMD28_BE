const expess = require("express");
const router = expess.Router();

const categoryController = require("../controllers/categoryView.controller");

router.get("/", categoryController.index);

module.exports = router;

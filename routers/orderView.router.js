const expess = require("express");
const router = expess.Router();

const order = require("../controllers/OrderView.Controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");

router.get("/", order.index);

module.exports = router;

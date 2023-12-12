const expess = require("express");
const router = expess.Router();

const order = require("../controllers/OrderView.Controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");
const middleWare = require("../middleWare/auth.middlewere");

router.get("/", middleWare.loggedin, order.index);
router.get("/:status", middleWare.loggedin, order.getstatus);
router.post("/changeStatus/:id", order.updateStatus);

module.exports = router;

const expess = require("express");
const router = expess.Router();

const order = require("../controllers/OrderView.Controller");
const cloudinary = require("../middleWare/cloudinary.middlewere");

router.get("/", order.index);
router.get("/:status", order.getstatus);
router.post("/changeStatus/:id", order.updateStatus);

module.exports = router;

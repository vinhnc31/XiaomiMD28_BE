const express = require("express");
const router = express.Router();
const colorController = require("../controllers/color.controller");
router.get("/color", colorController.getColor);
router.post("/color", colorController.createColor);
router.delete("/color/:id", colorController.deleteColor);

module.exports = router;

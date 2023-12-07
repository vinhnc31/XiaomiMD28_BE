const express = require("express");
const router = express.Router();
const internalController = require("../controllers/Internal_management.controller");

router.get("/internal", internalController.getInternal);
router.post("/internal", internalController.createInternal);
router.delete("/internal/:id", internalController.deleteInternal);
module.exports = router;

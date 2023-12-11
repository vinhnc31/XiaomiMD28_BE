const express = require("express");
const router = express.Router();
const internalController = require("../controllers/Internal_management.controller");

router.get("/internal", internalController.getInternal);
router.post("/internal", internalController.createInternal);
router.post("/internal/:id", internalController.deleteInternal);
router.get("/viewUpdate/:id", internalController.viewUpdate);
router.get("/addInternal", internalController.viewAddInternal);
module.exports = router;

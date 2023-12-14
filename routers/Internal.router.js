const express = require("express");
const router = express.Router();
const internalController = require("../controllers/Internal_management.controller");
const middleWare = require("../middleWare/auth.middlewere");

router.get("/internal", middleWare.loggedin,internalController.getInternal);
router.post("/internal", internalController.createInternal);
router.post("/internal/:id",internalController.deleteInternal);
router.get("/viewUpdate/:id", middleWare.loggedin,internalController.viewUpdate);
router.get("/addInternal", internalController.viewAddInternal);
module.exports = router;

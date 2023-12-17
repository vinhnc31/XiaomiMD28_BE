const express = require("express");
const router = express.Router();
const internalController = require("../controllers/Internal_management.controller");
const middleWare = require("../middleWare/auth.middlewere");

router.get("/internal", middleWare.loggedin,internalController.getInternal);
router.post("/internal", middleWare.loggedin,internalController.createInternal);
router.post("/internal/:id",middleWare.loggedin,internalController.deleteInternal);
router.get("/viewUpdate/:id", middleWare.loggedin,internalController.viewUpdate);
router.get("/addInternal", middleWare.loggedin,internalController.viewAddInternal);
router.post("/searchInternal", middleWare.loggedin,internalController.searchInternal);
module.exports = router;

const express = require("express");
const router = express.Router();
const notifyController = require("../controllers/notify.controller");
router.get("/notification/:AccountId", notifyController.getNotify);
router.post("/notification/:AccountId", notifyController.sendMessage);
router.post("/notification", notifyController.sendMessageAll);
module.exports = router;

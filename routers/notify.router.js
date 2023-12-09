const express = require("express");
const router = express.Router();
const notifyController = require("../controllers/notify.controller");
const authMidleWare = require("../middleWare/auth.middlewere");
router.get(
  "/notification/:AccountId",
  authMidleWare.apiAuth,
  notifyController.getNotify
);
router.post("/notification/:AccountId", notifyController.sendMessage);
router.post("/notification", notifyController.sendMessageAll);
module.exports = router;

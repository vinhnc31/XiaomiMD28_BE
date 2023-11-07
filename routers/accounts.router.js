const express = require("express");
const router = express.Router();
const account = require("../controllers/accounts.controller");
const authMidleWare = require("../middleWare/auth.middlewere");

router.post("/account/register", account.register);
router.post("/account/login", account.login);
router.get("/account/verify/:id/:token", account.verifyEmail);
router.get("/account/logout", authMidleWare.apiAuth, account.logout);
router.post(
  "/account/changePassword",
  authMidleWare.apiAuth,
  account.changPassword
);

module.exports = router;

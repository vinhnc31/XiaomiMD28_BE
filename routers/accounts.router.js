const express = require("express");
const router = express.Router();
const account = require("../controllers/accounts.controller");
const authMidleWare = require("../middleWare/auth.middlewere");

router.post("/register", account.register);
router.post("/login", account.login);
router.get("/verify/:idUser/:token", account.verifyEmail);
router.get("/logout", authMidleWare.apiAuth, account.logout);
router.post("/changePassword", authMidleWare.apiAuth, account.changPassword);
//router.get("/add", user.add);

module.exports = router;

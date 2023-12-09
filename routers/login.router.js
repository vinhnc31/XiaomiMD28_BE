const expess = require("express");
const router = expess.Router();

const login = require("../controllers/logion.Controller");
const middleWare = require("../middleWare/auth.middlewere");

router.post("/", login.login);
router.get("/logoutweb", middleWare.loggedin, login.logout);

module.exports = router;

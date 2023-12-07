const expess = require("express");
const router = expess.Router();

const login = require("../controllers/logion.Controller");

router.post("/", login.login);

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/accounts_google.controller");
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate("google", (err, profile) => {
      req.user = profile;

      next();
    })(req, res, next);
  },
  (req, res) => {
    res.redirect(
      `http://localhost:3000/api/auth/login-success/${req.user?.id}`
    );
  }
);
router.post("/auth/login-success", authController.loginSuccess);

module.exports = router;

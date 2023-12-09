const { Staff } = require("../models/index");
const bcrypt = require("bcrypt");
exports.login = async (req, res, next) => {
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
      return res.render("login", {
        status: 400,
        message: "Fields cannot be left blank",
        email: req.body.email,
        password: req.body.password,
      });
    }
    console.log(req.body.email);
    const result = await Staff.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!result) {
      return res.render("login", {
        status: 401,
        message: "Invalid email or password",
        email: req.body.email,
        password: req.body.password,
      });
    }
    console.log("chạy");
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );

    if (!isPasswordMatch) {
      return res.render("login", {
        status: 401,
        message: "Invalid email or password",
        email: req.body.email,
        password: req.body.password,
      });
    }
    req.session.loggedin = true;
    req.session.user = result;
    return res.redirect("/home");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.logout = (req, res) => {
  console.log("ok");
  req.session.destroy((err) => {
    if (err) res.redirect("/home");
    res.redirect("/");
  });
};

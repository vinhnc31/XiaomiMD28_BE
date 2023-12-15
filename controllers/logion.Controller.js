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

    const result = await Staff.findOne({
      where: {
        email: req.body.email,
      },
    });
    console.log(result)
    if (!result) {
      return res.render("login", {
        status: 401,
        message: "Invalid email or password",
        email: req.body.email,
        password: req.body.password,
      });
    }

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

    // Lưu thông tin người dùng vào session
    req.session.loggedin = true;
    req.session.user = {
      id: result.id,
      name: result.name,
      avatar: result.avatar,
      // Thêm các thông tin khác cần thiết
    };
console.log(req.session.user)
    return res.redirect("/home");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

exports.logout = (req, res) => {
  console.log("ok");
  req.session.destroy((err) => {
    if (err) res.redirect("/home");
    req.session.destroy()
    res.redirect("/");
  });
};

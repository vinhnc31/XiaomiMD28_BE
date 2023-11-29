const { Token } = require("../models");
const { User } = require("../models");
const { Account } = require("../models");
const bcrypt = require("bcrypt");
const sendEmail = require("../untils/email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config;
exports.getUserId = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SIGN_PRIVATE);
    console.log(decoded);
    const user = await User.findOne({
      where: {
        id: decoded.id,
      },
    });
    console.log(user);
    if (user) {
      return res.status(200).json({
        status: 200,
        message: "User found",
        user: user,
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.register = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(401).json({ message: "Invalid email, password,name" });
    }

    const user = req.body;
    console.log(user);
    const checkEmail = await Account.findOne({
      where: { email: req.body.email },
    });
    console.log(checkEmail);
    if (checkEmail) {
      console.log("verified email", checkEmail.verified);
      if (checkEmail.verified) {
        return res.status(409).json({
          status: 409,
          message: "Email already exists and is verified.",
        });
      } else {
        const salt = await bcrypt.genSalt(15);
        user.password = await bcrypt.hash(req.body.password, salt);

        checkEmail.password = user.password;
        await User.update(
          { name: user.name },
          {
            where: {
              id: checkEmail.id,
            },
          }
        );
        await Account.update(checkEmail, {
          where: {
            id: checkEmail.id,
          },
        });

        const newVerificationToken = await Token.create({
          email: checkEmail.email,
          token: require("crypto").randomBytes(32).toString("hex"),
        });

        const emailMessage = `http://localhost:3000/api/verify/${checkEmail.id}/${newVerificationToken.token}
`;
        console.log("email", checkEmail.email);
        await sendEmail(checkEmail.email, "Reverify Email", emailMessage);

        return res.status(200).json({
          status: 200,
          message:
            "Email already exists but is not verified. A verification email has been sent again.",
        });
      }
    }

    const id = crypto.randomBytes(5).toString("hex");
    user.id = id;
    // Tạo salt và mã hóa mật khẩu
    const salt = await bcrypt.genSalt(15);
    user.password = await bcrypt.hash(req.body.password, salt);
    console.log("ok");
    // Lưu tài khoản mới vào cơ sở dữ liệu
    let new_user = await User.create(user);
    console.log("new user", new_user);
    let new_account = await Account.create({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("new account", new_account);
    // Tạo và lưu token xác minh email
    let new_token = await Token.create({
      email: new_account.email,
      token: require("crypto").randomBytes(32).toString("hex"),
    });
    console.log("new token", new_token);
    // Tạo thông điệp xác minh email và gửi email xác minh
    const message = `http://localhost:3000/api/verify/${new_user.id}/${new_token.token}`;
    await sendEmail(new_account.email, "Verify Email", message);

    return res.status(201).json({
      status: 201,
      data: new_account,
      message:
        "An email has been sent to your account. Please verify your email.",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const user = await Account.findOne({ id: req.params.id });

    if (!user) return res.status(400).json({ message: "Invalid link" });
    const account = await Account.findOne({ id: req.params.id });

    const token = await Token.findOne({
      where: {
        email: account.email,
        token: req.params.token,
      },
    });

    if (!token) return res.status(400).json({ message: "Invalid link" });

    await Account.update(
      { verified: true },
      {
        where: {
          id: user.id,
        },
      }
    );
    await Token.destroy({ where: { id: token.id } });

    return res.status(200).json({
      status: 200,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(401)
        .json({ status: 401, message: "Email or password is empty" });
    }

    const result = await Account.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!result) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }

    // Kiểm tra xem email đã được xác minh chưa
    if (!result.verified) {
      return res
        .status(401)
        .json({ status: 401, message: "Email is not verified" });
    }

    // Tạo và lưu token cho người dùng
    const token = jwt.sign(
      { id: result.id, email: result.email },
      process.env.SIGN_PRIVATE,
      { expiresIn: "1y" }
    );
    await Token.create({ token: token, email: result.email });

    return res.status(200).json({
      status: 200,
      data: {
        id: result.id,
        email: result.email,
        token: token,
        verified: result.verified,
      },
      message: "Login successful!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.changePassword = async (req, res, next) => {
  const { password, newPassword, reNewPassword } = req.body;
  const id = req.params.id;

  try {
    // Kiểm tra xem newPassword và reNewPassword có khớp nhau không
    if (newPassword !== reNewPassword) {
      return res.json({
        status: 400,
        message: "Password and rePassword do not match",
      });
    }

    // Kiểm tra xem tài khoản có tồn tại không
    const account = await Account.findByPk(id);
    if (!account) {
      return res.json({ status: 400, message: "Account not found" });
    }

    // Kiểm tra xem mật khẩu hiện tại có đúng không
    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) {
      return res.json({ status: 400, message: "Incorrect password" });
    }

    // Tạo salt mới cho mật khẩu mới
    const salt = await bcrypt.genSalt(15);
    const changedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    const updatedAccount = await Account.update(
      { password: changedPassword },
      {
        where: {
          id: id,
        },
      }
    );

    if (!updatedAccount) {
      return res.json({
        status: 400,
        message: "Failed to connect to the database or update password",
      });
    }

    return res.json({
      status: 201,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.logout = async (req, res, next) => {
  try {
    // Xóa token của người dùng để đăng xuất
    await Token.destroy({
      where: {
        email: req.data.email,
      },
    });
    return res
      .status(200)
      .json({ status: 200, message: "Logout successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const checkEmail = await Account.findOne({ where: { email: email } });
    if (!checkEmail) {
      return res.status(404).json({ status: 404, message: "Email not found" });
    }
    if (!newPassword) {
      return res
        .status(400)
        .json({ status: 400, message: "Passwords cannot be protected" });
    }
    const salt = await bcrypt.genSalt(15);
    const changedPassword = await bcrypt.hash(newPassword, salt);
    const updatePassword = await Account.update(
      { password: changedPassword },
      { where: { email: email } }
    );
    if (!updatePassword) {
      return res.json({
        status: 400,
        message: "Failed to connect to the database or update password",
      });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Update password successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

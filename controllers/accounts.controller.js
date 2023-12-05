const { Token } = require("../models");
const { Account } = require("../models");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const sendEmail = require("../untils/email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config;

exports.getAccounts = async (req, res) => {
  try {
    const listUser = await Account.findAll();
    console.log(listUser);
    if (!listUser || listUser.length === 0) {
      return res.status(400).json({ status: 400, message: "No users found" });
    }

    return res.status(200).json({ status: 200, data: listUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getUserId = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SIGN_PRIVATE);
    console.log(decoded);
    const user = await Account.findOne({
      where: {
        id: decoded.id,
      },
    });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if required fields are present
    if (!email || !password || !name) {
      return res.status(401).json({
        message: "Invalid email, password, name, dayOfBirth, or gender",
      });
    }

    // Check if the email already exists
    const existingAccount = await Account.findOne({ where: { email } });

    if (existingAccount) {
      if (existingAccount.verified) {
        return res.status(409).json({
          status: 409,
          message: "Email already exists and is verified.",
        });
      } else {
        // If email is not verified, update the password and send verification email again
        const salt = await bcrypt.genSalt(15);
        const hashedPassword = await bcrypt.hash(password, salt);

        await Account.update(
          { password: hashedPassword, name },
          { where: { id: existingAccount.id } }
        );

        const newVerificationToken = await Token.create({
          email: existingAccount.email,
          token: crypto.randomBytes(32).toString("hex"),
        });

        const verificationLink = `http://localhost:3000/api/verify/${existingAccount.id}/${newVerificationToken.token}`;

        await sendEmail(
          existingAccount.email,
          "Reverify Email",
          verificationLink
        );

        return res.status(200).json({
          status: 200,
          message:
            "Email already exists but is not verified. A verification email has been sent again.",
        });
      }
    }

    // If the email does not exist, create a new account
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAccount = await Account.create({
      avatar:
        "https://res.cloudinary.com/dj9kuswbx/image/upload/v1701247814/wrumidwmedh4mfyeujtv.png",
      email,
      password: hashedPassword,
      name,
      dayOfBirth: "",
      gender: "",
      phone: "",
      fcmToken: "",
    });

    // Create a new verification token
    const newToken = await Token.create({
      email: newAccount.email,
      token: crypto.randomBytes(32).toString("hex"),
    });

    // Create a verification email message and send the email
    const verificationLink = `http://localhost:3000/api/verify/${newAccount.id}/${newToken.token}`;
    await sendEmail(newAccount.email, "Verify Email", verificationLink);

    return res.status(201).json({
      status: 201,
      data: newAccount,
      message:
        "An email has been sent to your account. Please verify your email.",
    });
  } catch (error) {
    console.error(error);
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
  const fcmToken = req.body.fcmToken;
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
    await result.update({ fcmToken: fcmToken });
    return res.status(200).json({
      status: 200,
      data: {
        id: result.id,
        avatar: result.avatar,
        email: result.email,
        name: result.name,
        password: result.password,
        dayOfBirth: result.dayOfBirth,
        gender: result.gender,
        phone: result.phone,
        token: token,
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

exports.updateProfile = async (req, res) => {
  const AccountId = req.params.id; // Assuming the route parameter is named 'id'
  const { avatar, name, dayOfBirth, gender, phone } = req.body;
  const fileData = req.file;
  console.log(fileData);
  try {
    console.log(req.body);
    const checkAccount = await Account.findByPk(AccountId);
    if (!checkAccount) {
      return res
        .status(404)
        .json({ status: 404, message: "Account not found" });
    }

    let imageUrl = checkAccount.avatar;
    console.log(imageUrl);
    // If there's a file, upload it to Cloudinary
    if (fileData) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(fileData.path);
      imageUrl = result.secure_url;
    } else if (avatar) {
      imageUrl = avatar;
    }

    // Update the account information
    const updatedAccount = await Account.update(
      { avatar: imageUrl, name, dayOfBirth, gender, phone },
      { where: { id: AccountId } }
    );
    console.log(updatedAccount);
    if (!updatedAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "Failed to update profile" });
    }

    return res
      .status(200)
      .json({ status: 200, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

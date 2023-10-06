const Token = require("../models/token.model");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const SIGN_PRIVATE = "xiaomimd28";
const jwt = require("jsonwebtoken");
//dang ký
exports.register = async (req, res, next) => {
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(401).json({ message: "Invalid email, password" });
    }

    const user = new userModel(req.body);
    const data = await userModel.findByEmail(user.email);

    if (data) {
      if (data.verified) {
        return res.status(409).json({
          status: 409,
          message: "Email already exists and is verified.",
        });
      } else {
        const salt = await bcrypt.genSalt(15);
        user.password = await bcrypt.hash(req.body.password, salt);
        data.password = user.password;
        await userModel.updateByEmail(req.body.email, data, (err, data) => {});
        const newVerificationToken = await new Token({
          idUser: data.idUser,
          token: require("crypto").randomBytes(32).toString("hex"),
        });
        Token.create(newVerificationToken, async (err, data) => {});
        const emailMessage = `http://localhost:3000/users/verify/${data.idUser}/${newVerificationToken.token}`;
        await sendEmail(data.email, "Reverify Email", emailMessage);
        return res.status(200).json({
          status: 200,
          message:
            "Email already exists but is not verified. A verification email has been sent again.",
        });
      }
    } else {
      const salt = await bcrypt.genSalt(15);
      user.password = await bcrypt.hash(req.body.password, salt);
      await userModel.create(user, async (err, data) => {
        console.log("tạo user");
      });
      await userModel.findByEmail(user.email).then(async (data) => {
        console.log(data);
        let token = await new Token({
          idUser: data.idUser,
          token: require("crypto").randomBytes(32).toString("hex"),
        });
        await Token.create(token, async (err, data) => {});
        const message = `http://localhost:3000/users/verify/${data.idUser}/${token.token}`;
        await sendEmail(data.email, "Veryfy Email", message);
        return res.status(200).json({
          status: 201,
          data: data,
          message:
            "An email has been sent to your account. Please verify your email.",
        });
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
exports.login = async (req, res, next) => {
  try {
    userModel.findByEmail(req.body.email).then(async (data) => {
      if (!data) {
        return res.status(401).json({ message: "Email not found" });
      }

      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        data.password
      );
      console.log(isPasswordMatch);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Password not match" });
      }
      if (!data.verified) {
        return res
          .status(401)
          .json({ status: 401, message: "Email is not verified" });
      }
      const token = jwt.sign(
        { idUser: data.idUser, email: data.email },
        SIGN_PRIVATE,
        { expiresIn: "1y" }
      );
      await Token.create(
        { token: token, idUser: data.idUser },
        (err, token) => {}
      );
      return res.status(200).json({
        status: 200,
        data: {
          idUser: data.idUser,
          email: data.email,
          token: token,
          verified: data.verified,
        },
        message: "Login successfully!",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
exports.verifyEmail = async (req, res) => {
  try {
    await userModel.findById(req.params.idUser, async (err, data) => {
      if (!data) {
        return res.status(400).json({ message: "Invalid link" });
      }
      await Token.findByIdAndToken(
        data.idUser,
        req.params.token,
        async (err, token) => {
          if (!token) {
            return res.status(400).json({ message: "Invalid link" });
          }
          await userModel.updateVerify(data.idUser, true, (err, res) => {});
          await Token.deleteByID(data.idUser, (err, res) => {});
          return res.status(200).json({
            status: 200,
            message: "Email verified successfully",
          });
        }
      );
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, message: "An error occurred" });
  }
};

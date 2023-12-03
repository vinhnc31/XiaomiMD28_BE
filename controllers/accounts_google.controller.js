const jwt = require("jsonwebtoken");
const { Account, Token } = require("../models");
const {
  OAuth2Client,
} = require("google-auth-library/build/src/auth/oauth2client");
require("dotenv").config();

async function verifyGoogleIdToken(token) {
  const client = new OAuth2Client();
  try {
    console.log("aaaaa");
    console.log(token);
    console.log(process.env.CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      requiredAudience: process.env.CLIENT_ID,
    });
    console.log("vvvvvv");
    const payload = ticket.getPayload();
    console.log(payload);
    return payload;
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    return null;
  }
}
exports.generateToken = (req, res) => {
  const { id_token } = req.body;
  console.log(req.body);
  console.log(id_token);
  verifyGoogleIdToken(id_token)
    .then(async (googleTokenInfo) => {
      if (googleTokenInfo) {
        const existingAccount = await Account.findOne({
          where: { email: googleTokenInfo.email },
        });

        if (existingAccount) {
          return res.status(409).json({
            status: 409,
            message: "Email already exists",
          });
        }
        const newTokenPayload = {
          sub: googleTokenInfo.sub,
          email: googleTokenInfo.email,
          custom_data: "Your_custom_data_here",
        };
        const newToken = jwt.sign(newTokenPayload, process.env.SIGN_PRIVATE, {
          expiresIn: "1y",
        });
        await Token.create({ token: newToken, email: newTokenPayload.email });
        const createAccountGoogle = await Account.create({
          avatar: googleTokenInfo.picture,
          email: googleTokenInfo.email,
          password: "",
          name: googleTokenInfo.name,
          verified: 1,
          dayOfBirth: "",
          gender: "",
          phone: "",
        });
        if (!createAccountGoogle) {
          return res
            .status(400)
            .json({ status: 400, message: "connect fail database" });
        }
        return res.status(201).json({
          status: 201,
          data: {
            id: createAccountGoogle.id,
            avatar: googleTokenInfo.picture,
            email: googleTokenInfo.email,
            name: googleTokenInfo.name,
            password: "",
            dayOfBirth: "",
            gender: "",
            phone: "",
            token: newToken,
          },
        });
      } else {
        return res
          .status(400)
          .json({ status: 400, message: "Invalid Google ID token" });
      }
    })
    .catch((error) => {
      console.error("Error verifying Google ID token:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    });
};

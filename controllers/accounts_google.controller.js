exports.loginSuccess = async (req, res, next) => {
  try {
    const token = jwt.sign(
      { idUser: account.idUser, email: account.email },
      SIGN_PRIVATE,
      { expiresIn: "1y" }
    );
    await Token.create({ token: token, email: result.email });

    return res.status(200).json({
      status: 200,
      data: {
        idUser: account.idUser,
        email: account.email,
        token: token,
        verified: account.verified,
      },
      message: "Login successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

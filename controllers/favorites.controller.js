const { Favorites, Product } = require("../models");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
exports.getFavorites = async (req, res) => {
  try {
    const listFavorites = await Favorites.findAll({
      include: [
        {
          model: Product,
        },
      ],
      attributes: [
        "ProductId",
        [sequelize.fn("COUNT", sequelize.col("ProductId")), "totalFavorites"],
      ],
      group: ["ProductId"],
      order: [[sequelize.literal("totalFavorites"), "DESC"]],
      limit: 10,
    });
    if (!listFavorites) {
      return res
        .status(404)
        .json({ status: 404, message: "favorites not found" });
    }
    return res.status(200).json({ status: 200, data: listFavorites });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.getAccount = async (req, res) => {
  const AccountId = +req.params.AccountId;
  try {
    if (!AccountId) {
      return res
        .status(400)
        .json({ status: 400, message: "Please provide AccountId" });
    }
    const favorites = await Favorites.findAll({
      where: { AccountId },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (!favorites) {
      return res
        .status(400)
        .json({ status: 400, message: "Please provide AccountId" });
    }
    return res.status(200).json({ status: 200, data: favorites });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.createFavorites = async (req, res) => {
  const { AccountId, productId } = req.body;
  try {
    if (!AccountId || !productId) {
      return res.status(400).json({
        status: 400,
        message: "Please provide AccountId and ProductId",
      });
    }

    const favorites = { AccountId, productId };
    const createFavorites = await Favorites.create(favorites);
    if (!createFavorites) {
      return res.status(400).json({
        status: 400,
        message: "Please provide AccountId and ProductId",
      });
    }
    return res.status(201).json({ status: 201, data: createFavorites });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteFavorites = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SIGN_PRIVATE);

    // Lấy thông tin người dùng từ decodedToken
    const userId = decodedToken.id;
    const checkId = await Favorites.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }
    if (userId !== checkId.AccountId) {
      return res.status(403).json({ status: 403, message: "Forbidden" });
    }
    if (!checkId) {
      return res
        .status(400)
        .json({ status: 400, message: "Please provide id" });
    }
    const deleteFavorites = await checkId.destroy();
    if (!deleteFavorites) {
      return res
        .status(400)
        .json({ status: 400, message: "Please provide id" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "delete successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

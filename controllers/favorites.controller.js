const { Favorites } = require("../models");
exports.getAccount = async (req, res) => {
  const AccountId = +req.params.AccountId;
  if (!AccountId) {
    return res
      .status(400)
      .json({ status: 400, message: "Please provide AccountId" });
  }
  const favorites = await Favorites.findAll({ where: { AccountId } });
  if (!favorites) {
    return res
      .status(400)
      .json({ status: 400, message: "Please provide AccountId" });
  }
  return res.status(200).json({ status: 200, data: favorites });
};
exports.createFavorites = async (req, res) => {
  const { AccountId, ProductId } = req.body;
  if (!AccountId || !ProductId) {
    return res
      .status(400)
      .json({ status: 400, message: "Please provide AccountId and ProductId" });
  }

  const favorites = { AccountId, ProductId };
  const createFavorites = await Favorites.create(favorites);
  if (!createFavorites) {
    return res
      .status(400)
      .json({ status: 400, message: "Please provide AccountId and ProductId" });
  }
  return res.status(201).json({ status: 201, data: createFavorites });
};

exports.deleteFavorites = async (req, res) => {
  const id = req.params.id;
  const whereId = Favorites.findByPk(id);
  if (!whereId) {
    return res.status(400).json({ status: 400, message: "Please provide id" });
  }
  const deleteFavorites = await whereId.destroy();
  if (!deleteFavorites) {
    return res.status(400).json({ status: 400, message: "Please provide id" });
  }
  return res.status(204).json({ status: 204, message: "delete successfully" });
};

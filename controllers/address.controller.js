const { Address } = require("../models");

exports.getAccountId = async (req, res) => {
  const AccountId = req.params.AccountId;
  try {
    if (!AccountId) {
      return res.status(404).json({ status: 404, message: "Invalid Account" });
    }
    const account = await Address.findAll({ where: { AccountId: AccountId } });

    if (!account) {
      return res
        .status(404)
        .json({ status: 404, message: "Account not found" });
    }
    return res.status(200).json({ status: 200, data: account });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createAddress = async (req, res) => {
  const { province, district, commune, AccountId } = req.body;
  try {
    if (!AccountId) {
      return res.status(404).json({ status: 404, message: "Invalid Account" });
    }
    if (!province || !district || !commune) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    const address = { province, district, commune, AccountId };
    const createAddress = Address.create(address);
    if (!createAddress) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(201).json({ status: 201, data: createAddress });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateAddress = async (req, res) => {
  const { province, district, commune, AccountId } = req.body;
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(404).json({ status: 404, message: "Invalid Address" });
    }
    const address = { province, district, commune, AccountId };

    const updateAddress = await Address.update(address, { where: { id: id } });
    if (!updateAddress) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, data: updateAddress });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteAddress = async (req, res) => {
  const id = req.params.id;
  const address = await Address.findByPk(id);
  if (!address) {
    return res.status(404).json({ status: 404, message: "Address not found" });
  }
  const deleteAddress = await address.destroy();
  if (!deleteAddress) {
    return res
      .status(500)
      .json({ status: 500, message: "Error connecting to database" });
  }
  return res.status(200).json({ status: 200, message: "Delete successfuly" });
};

const { Account, Product, Staff, Orders } = require("../models");

exports.getAccount = async (req, res) => {
  try {
    const totalAccount = await Account.count("id");
    console.log(totalAccount);
    if (!totalAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalAccount: totalAccount });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const totalProduct = await Product.count("id");
    console.log(totalAccount);
    if (!totalAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalProduct: totalProduct });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const totalOrder = await Orders.count("id");
    console.log(totalAccount);
    if (!totalAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalOrder: totalOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const totalStaff = await Staff.count("id");
    console.log(totalAccount);
    if (!totalAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalStaff: totalStaff });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getAccountNew = async (req, res) => {
  try {
    const listAccount = await Account.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (!listAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, data: listAccount });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getOrderNew = async (req, res) => {
  try {
    const listOrder = await Account.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (!listOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, data: listOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const totalAccount = await Account.count("id");
    const totalProduct = await Product.count("id");
    const totalOrder = await Orders.count("id");
    const totalStaff = await Staff.count("id");

    const listAccount = await Account.findAll({
      order: [["createdAt", "DESC"]],
    });

    const listOrder = await Orders.findAll({
      include: [{ model: Account, as: "account" }],
      order: [['createdAt', 'DESC']]
    });

    if (!totalAccount || !totalProduct || !totalOrder || !totalStaff || !listAccount || !listOrder) {
      return res.status(400).json({ status: 400, message: "Connect fail database or data not found" });
    }
    console.log(listAccount)
    res.render("home", {
      totalAccount: totalAccount,
      totalProduct: totalProduct,
      totalOrder: totalOrder,
      totalStaff: totalStaff,
      listAccount: listAccount,
      listOrder: listOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
}; 
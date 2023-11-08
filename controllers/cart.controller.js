const { Cart, Product, Account, Product_Color } = require("../models");
exports.getCartByAccount = async (req, res) => {
  const AccountId = req.params.AccountId;
  try {
    const account = Account.findByPk(AccountId);
    console.log("Account.........." + account);
    if (!account) {
      return res
        .status(404)
        .json({ status: 404, message: "Account not found" });
    }
    console.log("chạy");
    const listCart = await Cart.findAll({ where: { AccountId: AccountId } });
    console.log("ok");
    if (!listCart) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, data: listCart });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createCart = async (req, res) => {
  const { productId, AccountId, ProductColorId, quantity } = req.body;
  console.log(req.body);
  try {
    if (ProductColorId) {
      const ProductColor = await Product_Color.findByPk(ProductColorId);
      if (!ProductColor) {
        return res.status(404).json({
          status: 404,
          message: "ProductColor not found",
        });
      }
    }

    const product = await Product.findByPk(productId);
    const account = await Account.findByPk(AccountId);
    console.log("Product.........." + product);
    console.log("Account.........." + account);
    console.log("total......" + product.price);
    if (!product || !account) {
      return res.status(404).json({
        status: 404,
        message: "Product or Account not found",
      });
    }

    const cart = {
      productId,
      AccountId,
      ProductColorId,
      quantity,
      total_Price: product.price * quantity,
    };
    console.log(cart.total_Price);
    const createCart = await Cart.create(cart);
    if (!createCart) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(201).json({
      status: 201,
      data: createCart,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateCart = async (req, res) => {
  const id = req.params.id;
  const { productId, AccountId, ProductColorId, quantity } = req.body;
  try {
    const checkId = await Cart.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }
    const cart = { productId, AccountId, ProductColorId, quantity };
    const updateCart = await Cart.update(cart, { where: { id: id } });
    if (!updateCart) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "update successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteCart = async (req, res) => {
  const id = req.params.id;
  try {
    const checkId = await Cart.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Cart not found" });
    }
    const deleteCart = await checkId.destroy();
    if (!deleteCart) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res
      .status(204)
      .json({ status: 204, message: "delete successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

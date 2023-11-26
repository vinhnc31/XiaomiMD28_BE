const {
  Orders,
  Account,
  Address,
  Pay,
  Product,
  Promotion,
  productcolor,
  ProductColorConfig,
} = require("../models");

exports.getListOrder = async (req, res) => {
  try {
    const listOrder = await Orders.findAll();
    if (!listOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, data: listOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getListOrderInAccountAndStatus = async (req, res) => {
  const { AccountId, status } = req.query;
  console.log("AccountId:", AccountId);
  console.log("status:", status);
  try {
    const listOrder = await Orders.findAll({
      where: { AccountId: AccountId, status: status },
    });

    if (!listOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "fail connecting database" });
    }

    return res.status(200).json({ status: 200, data: listOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createOrder = async (req, res) => {
  const { message, status, AccountId, AddressId, PayId, products } = req.body;
  const date = new Date();

  try {
    const account = await Account.findByPk(AccountId);
    const address = await Address.findByPk(AddressId);
    const pay = await Pay.findByPk(PayId);

    if (!account || !address || !pay) {
      return res.status(404).json({
        status: 404,
        message: "Account or Address or Pay not found",
      });
    }

    let totalPrice = 0;

    for (const productInfo of products) {
      const {
        quantity,
        productId,
        PromotionId,
        ProductColorId,
        ProductColorConfigId,
      } = productInfo;
      const product = await Product.findByPk(productId);
      const productColor = await productcolor.findByPk(ProductColorId);
      const productColorConfig = await ProductColorConfig.findByPk(
        ProductColorConfigId
      );

      if (!product) {
        return res.status(404).json({
          status: 404,
          message: "Product not found",
        });
      }

      if (ProductColorId && ProductColorConfigId) {
        if (!productColor || !productColorConfig) {
          return res.status(404).json({
            status: 404,
            message: "ProductColor or ProductColorConfig not found",
          });
        }
        if (PromotionId) {
          const promotion = await Promotion.findByPk(PromotionId);
          if (!promotion) {
            return res.status(404).json({
              status: 404,
              message: "Promotion not found",
            });
          }
          if (promotion.endDate > date) {
            return res.status(400).json({
              status: 400,
              message: "Promotion expired",
            });
          }
          totalPrice +=
            productColorConfig.price *
            quantity *
            (1 - promotion.discount / 100);
        } else {
          totalPrice += productColorConfig.price * quantity;
        }
      } else {
        if (PromotionId) {
          const promotion = await Promotion.findByPk(PromotionId);
          if (!promotion) {
            return res.status(404).json({
              status: 404,
              message: "Promotion not found",
            });
          }
          if (promotion.endDate > date) {
            return res.status(400).json({
              status: 400,
              message: "Promotion expired",
            });
          }
          totalPrice +=
            product.price * quantity * (1 - promotion.discount / 100);
        } else {
          totalPrice += product.price * quantity;
        }
      }
    }

    // Use the provided status from the request body
    const order = {
      message,
      status: 0,
      AccountId,
      AddressId,
      PayId,
      ...products[0],
      total: totalPrice,
    };
    console.log("order:", order);

    const createOrder = await Orders.create(order);
    console.log(createOrder);
    if (!createOrder) {
      return res.status(400).json({
        status: 400,
        message: "Fail connecting to the database",
      });
    }
    return res.status(201).json({ status: 201, data: createOrder });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateOrder = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const whereId = await Orders.findByPk(id);
    if (!whereId) {
      return res.status(404).json({ status: 404, message: "Order not found" });
    }
    const updateOrder = await Orders.update(status);
    if (!updateOrder) {
      return res
        .status(500)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Update successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

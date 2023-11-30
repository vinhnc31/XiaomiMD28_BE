const {
  Orders,
  Account,
  Address,
  Pay,
  Product,
  Promotion,
  productcolor,
  ProductColorConfig,
  sequelize,
  OrdersProduct,
} = require("../models");

exports.getListOrder = async (req, res) => {
  try {
    const listOrder = await Orders.findAll({
      include: [
        {
          model: OrdersProduct,
          include: [{ model: productcolor }, { model: ProductColorConfig }],
        },
        { model: Address },
      ],
    });
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
      include: [
        {
          model: OrdersProduct,
          include: [{ model: productcolor }, { model: ProductColorConfig }],
        },
        { model: Address },
      ],
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
  const {
    message,
    status,
    AccountId,
    AddressId,
    PayId,
    PromotionId,
    products,
  } = req.body;
  const date = new Date();

  const transaction = await sequelize.transaction(); // Assuming you're using Sequelize

  try {
    const account = await Account.findByPk(AccountId);
    const address = await Address.findByPk(AddressId);
    const pay = await Pay.findByPk(PayId);

    if (!AddressId || !AccountId || !PayId) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    if (!account || !address || !pay) {
      await transaction.rollback();
      return res.status(404).json({
        status: 404,
        message: "Account or Address or Pay not found",
      });
    }

    let totalPrice = 0;

    const createdOrder = await Orders.create(
      {
        message,
        status: 0,
        AccountId,
        AddressId,
        PayId,
        PromotionId,
        total: totalPrice,
      },
      { transaction }
    );

    for (const productData of products) {
      const { quantity, productId, ProductColorId, ProductColorConfigId } =
        productData;

      const product = await Product.findByPk(productId);
      const productColor = await productcolor.findByPk(ProductColorId);
      const productColorConfig = await ProductColorConfig.findByPk(
        ProductColorConfigId
      );

      if (
        !product ||
        (!productColor && ProductColorId) ||
        (!productColorConfig && ProductColorConfigId)
      ) {
        await transaction.rollback();
        return res.status(404).json({
          status: 404,
          message: "One or more products not found",
        });
      }

      if (ProductColorId && ProductColorConfigId) {
        if (PromotionId) {
          const promotion = await Promotion.findByPk(PromotionId);
          if (!promotion) {
            await transaction.rollback();
            return res.status(404).json({
              status: 404,
              message: "Promotion not found",
            });
          }
          if (promotion.endDate > date) {
            await transaction.rollback();
            return res.status(400).json({
              status: 404,
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
            await transaction.rollback();
            return res.status(404).json({
              status: 404,
              message: "Promotion not found",
            });
          }
          if (promotion.endDate > date) {
            await transaction.rollback();
            return res.status(400).json({
              status: 404,
              message: "Promotion expired",
            });
          }
          totalPrice +=
            product.price * quantity * (1 - promotion.discount / 100);
        } else {
          totalPrice += product.price * quantity;
        }
      }

      // Create record in the ordersProduct table for each product
      await OrdersProduct.create(
        {
          quantity,
          productId,
          ProductColorId,
          ProductColorConfigId,
          OrderId: createdOrder.id, // Assuming there is a foreign key relationship
        },
        { transaction }
      );
    }

    // Update the total price in the created order
    await createdOrder.update({ total: totalPrice }, { transaction });

    await transaction.commit();

    // Return success response
    return res.status(201).json({
      status: 201,
      message: "Order successfully",
    });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
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

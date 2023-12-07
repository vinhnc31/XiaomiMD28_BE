const {
  Orders,
  Account,
  Address,
  Pay,
  Product,
  Color,
  Config,
  Promotion,
  productcolor,
  ProductColorConfig,
  sequelize,
  OrdersProduct,
} = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config;
exports.getListOrder = async (req, res) => {
  try {
    const listOrder = await Orders.findAll({
      include: [
        {
          model: OrdersProduct,
          include: [
            { model: Product },
            { model: productcolor, include: [{ model: Color }] },
            { model: ProductColorConfig, include: { model: Config } },
          ],
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
          include: [
            { model: Product },
            { model: productcolor, include: [{ model: Color }] },
            { model: ProductColorConfig, include: { model: Config } },
          ],
        },
        { model: Address },
        { model: Promotion },
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
    statusOrder,
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
        statusOrder: 0,
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
        await ProductColorConfig.update(
          { quantity: sequelize.literal(`quantity - ${quantity}`) },
          { where: { id: ProductColorConfigId }, transaction }
        );
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
    // Update the quantity in the product table

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
  const status = req.body.status;

  // Kiểm tra xem token có được chuyển lên không
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  try {
    // Giải mã token để lấy thông tin người dùng
    const decodedToken = jwt.verify(token, process.env.SIGN_PRIVATE);

    // Lấy thông tin người dùng từ decodedToken
    const userId = decodedToken.id;
    console.log(userId);
    const userName = decodedToken.name; // Ví dụ: nếu token chứa thông tin về tên người dùng

    // Tiếp tục xử lý cập nhật đơn hàng
    const whereId = await Orders.findByPk(id);

    if (!whereId) {
      return res.status(404).json({ status: 404, message: "Order not found" });
    }

    // Kiểm tra xem userId có khớp với id của người dùng cần cập nhật hay không
    if (userId !== whereId.AccountId) {
      return res.status(403).json({ status: 403, message: "Forbidden" });
    }

    console.log(`User ${userName} is updating order status`);

    const updateOrder = await Orders.update(
      { status: status },
      { where: { id: id } }
    );

    if (!updateOrder) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
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

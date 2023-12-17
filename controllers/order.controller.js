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
  notifyAccount,
} = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config;

const FCM = require("fcm-node");
const fcm = new FCM(process.env.FCM);

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
      order: [["createdAt", "DESC"]],
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
        if (productColorConfig.quantity === 0) {
          return res.status(400).json({
            status: 400,
            message: "The product is out of stock",
          });
        }
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
          if (promotion.quantity === 0) {
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
          const update = await promotion.update(
            { quantity: sequelize.literal(`quantity - ${quantity}`) },
            { where: { id: productId }, transaction }
          );
          console.log(update);
        } else {
          totalPrice += productColorConfig.price * quantity;
        }
        const update = await ProductColorConfig.update(
          { quantity: sequelize.literal(`quantity - ${quantity}`) },
          { where: { id: ProductColorConfigId }, transaction }
        );
        console.log(update);
      } else {
        if (product.quantity === 0) {
          return res.status(400).json({
            status: 400,
            message: "The product is out of stock",
          });
        }
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
          if (promotion.quantity === 0) {
            await transaction.rollback();
            return res.status(400).json({
              status: 404,
              message: "Promotion expired",
            });
          }
          totalPrice +=
            product.price * quantity * (1 - promotion.discount / 100);
          const update = await promotion.update(
            { quantity: sequelize.literal(`quantity - ${quantity}`) },
            { where: { id: productId }, transaction }
          );
          console.log(update);
        } else {
          totalPrice += product.price * quantity;
        }
        const update = await Product.update(
          { quantity: sequelize.literal(`quantity - ${quantity}`) },
          { where: { id: productId }, transaction }
        );
        console.log(update);
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
    const AccountId = whereId.AccountId;
    let title = "";
    let content = "";
    if (status === "2") {
      title = "Thông báo!";
      content =
        "Đơn hàng với mã " +
        id +
        " đã hoàn thành .Xin cảm ơn Quý khách đã tin tưởng dịch vụ của chúng tôi.";
    }
    if (status === "3") {
      title = "Thông báo!";
      content =
        "Đơn hàng với mã " +
        id +
        " đã bị hủy. Mọi thắc mắc vui lòng liên hệ tới hotline : 1900 1006 . Xin cảm ơn Quý khách";
    }
    const user = await Account.findByPk(AccountId);
    const registrationToken = user.fcmToken;
    console.log(registrationToken);
    const message = {
      notification: {
        title: title,
        body: content,
      },
      to: registrationToken,
    };
    console.log(message);
    // Send the notification with a callback function
    console.log(fcm);
    fcm.send(message, async (err, response) => {
      if (err) {
        console.error("Error sending message:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      }

      // Save the notification in the Notify model
      await notifyAccount.create({
        title: title,
        content: content,
        AccountId: AccountId,
        OrderId: id,
      });

      console.log("Successfully sent message:", response);
    });
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

exports.updateStatusOrders = async (req, res) => {
  const id = req.params.id;
  const statusOrder = req.body.statusOrder;

  // Kiểm tra xem token có được chuyển lên không
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  try {
    // Giải mã token để lấy thông tin người dùng
    console.log(statusOrder);
    const decodedToken = jwt.verify(token, process.env.SIGN_PRIVATE);
    const userId = decodedToken.id;
    console.log(userId);
    const userName = decodedToken.name;

    const whereId = await Orders.findByPk(id);
    if (!whereId) {
      return res.status(404).json({ status: 404, message: "Order not found" });
    }
    console.log(whereId.status);
    // kiểm tra xem đơn hàng đã dduwoj hoàn thành hay chưa
    if (whereId.status !== "2") {
      return res.status(400).json({ status: 400, message: "Order unfinished" });
    }
    // Kiểm tra xem userId có khớp với id của người dùng cần cập nhật hay không
    if (userId !== whereId.AccountId) {
      return res.status(403).json({ status: 403, message: "Forbidden" });
    }

    console.log(`Updating order with id ${id} to status ${statusOrder}`);

    const updateOrder = await Orders.update(
      { statusOrder: statusOrder },
      { where: { id: id } }
    );

    if (!updateOrder) {
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

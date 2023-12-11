const {
  Orders,
  OrdersProduct,
  Address,
  Account,
  Product,
  productcolor,
  Color,
  ProductColorConfig,
  Config,
  notifyAccount,
} = require("../models/index");
const FCM = require("fcm-node");
//const fcm = new FCM(process.env.FCM);
const fcm = new FCM(
  "AAAAjF46CC4:APA91bGm5n9UYevBNVrCWA_MWgGw8SJRN3_L28XU1pJ8pwsTHWdoSZMqPibQoB3az5akJtcNMVWtIPDA9jQb9dy2zTOrh5w3Eui5wAh9WeaUux6wpX9bPgaxFVIJNDClWac2HzlZ6Kq9"
);

exports.index = async (req, res) => {
  try {
    let _name = req.query.name;
    console.log(_name);
    if (!_name) {
      _name = "";
    }
    let _page = req.query.page ? req.query.page : 1;
    let listOrder = [];
    let _limit = Number(req.query.limit ? req.query.limit : 10);
    let totalRow = await Orders.count();
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

    if (_name) {
      listOrder = await Orders.findAll({
        // where: {
        //   name: { [Op.like]: `%${_name}%` },
        // },
        offset: _start,
        limit: _limit,
        include: {
          model: Account,
        },
      });
    } else {
      listOrder = await Orders.findAll({
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
          { model: Account },
        ],
        offset: _start,
        limit: _limit,
        order: [["id", "DESC"]],
      });
    }
    return res.render("Order", {
      data: listOrder,
      search: _name,
      totalPage: totalPage,
      name: _name,
      page: _page,
      status: -1,

      //return res.status(200).json({ status: 200, data: listOrder });
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getstatus = async (req, res) => {
  try {
    let _name = req.query.name;
    let _status = req.params.status;
    let status = 0;
    console.log(_status);
    if (_status === "choxacnhan") {
      status = 0;
    }
    if (_status === "danggiaohang") {
      status = 1;
    }
    if (_status === "dahoanthanh") {
      status = 2;
    }
    if (_status === "dahuy") {
      status = 3;
    }
    console.log(_name);
    if (!_name) {
      _name = "";
    }
    console.log(status);

    let _page = req.query.page ? req.query.page : 1;
    let listOrder = [];

    let _limit = Number(req.query.limit ? req.query.limit : 10);
    let totalRow = await Orders.count();
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

    if (_name) {
      listOrder = await Orders.findAll({
        // where: {
        //   name: { [Op.like]: `%${_name}%` },
        // },
        where: {
          status: status,
        },
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
          { model: Account },
        ],
        offset: _start,
        limit: _limit,
        order: [["id", "DESC"]],
      });
    } else {
      listOrder = await Orders.findAll({
        where: {
          status: status,
        },
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
          { model: Account },
        ],
        offset: _start,
        limit: _limit,
        order: [["id", "DESC"]],
      });
    }
    for (let i = 0; i < listOrder.length; i++) {
      if (listOrder[i].OrdersProducts.ProductColorConfig === null) {
        listOrder[i].OrdersProducts.ProductColorConfig = {
          Config: {
            nameConfig: "Tiêu chuẩn",
          },
        };
      }
    }

    return res.render("Order", {
      data: listOrder,
      search: _name,
      totalPage: totalPage,
      name: _name,
      page: _page,
      status: status,

      //return res.status(200).json({ status: 200, data: listOrder });
    });
  } catch (error) {
    console.log(error);
  }
};
exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  try {
    const whereId = await Orders.findByPk(id, {
      include: [
        {
          model: Account,
        },
      ],
    });

    if (!whereId) {
      return res.status(404).json({ status: 404, message: "Order not found" });
    }
    // Kiểm tra xem userId có khớp với id của người dùng cần cập nhật hay không

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
    if (status === "1") {
      title = "Thông báo!";
      content =
        "Đơn hàng với mã " +
        id +
        " đã được xác nhận thành công. Đơn hàng đang được đưa tới đơn vị vận chuyển. Quý khách vui lòng kiểm tra thường xuyên để cập nhật trạng thái mới nhất.Xin cảm ơn Quý khách.";
    }
    if (status === "3") {
      title = "Thông báo!";
      content =
        "Đơn hàng với mã " +
        id +
        " đã bị hủy. Mọi thắc mắc vui lòng liên hệ tới hotline : 1900 1006 . Xin cảm ơn Quý khách";
    }

    // Retrieve the user's fcmToken from the Account model
    //const user = await Account.findByPk(AccountId);
    const user = await Account.findByPk(AccountId);
    const registrationToken = await user.fcmToken;
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
      });

      console.log("Successfully sent message:", response);
    });

    return res.redirect("/order/choxacnhan");
    //return res.status(200).json({ status: 200, message: "update thành công" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

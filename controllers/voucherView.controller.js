const cloudinary = require("cloudinary").v2;
const { Promotion, Account, notifyAccount } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const FCM = require("fcm-node");
const { Op } = require("sequelize");
//const fcm = new FCM(process.env.FCM);
const fcm = new FCM(
  "AAAAjF46CC4:APA91bGm5n9UYevBNVrCWA_MWgGw8SJRN3_L28XU1pJ8pwsTHWdoSZMqPibQoB3az5akJtcNMVWtIPDA9jQb9dy2zTOrh5w3Eui5wAh9WeaUux6wpX9bPgaxFVIJNDClWac2HzlZ6Kq9"
);
exports.getData = async (req, res) => {
  try {
    let _name = req.query.name;
    console.log(_name);

    if (!_name) {
      _name = "";
    }

    let _page = req.query.page ? req.query.page : 1;
    let listPromotion = [];

    let _limit = Number(req.query.limit ? req.query.limit : 10);
    let totalRow = await Promotion.count();
    let totalPage =
      Math.ceil(totalRow / _limit) > 0 ? Math.ceil(totalRow / _limit) : 1;
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

    if (_name) {
      listPromotion = await Promotion.findAll({
        where: {
          name: { [Op.like]: `%${_name}%` },
        },
        offset: _start,
        limit: _limit,
      });
    } else {
      listPromotion = await Promotion.findAll({
        offset: _start,
        limit: _limit,
      });
    }
    let promotion = [];
    for (let i = 0; i < listPromotion.length; i++) {
      let formattedStartDate = moment(listPromotion[i].startDate).format(
        "DD-MM-YYYY"
      );
      let formattedEndDate = moment(listPromotion[i].endDate).format(
        "DD-MM-YYYY"
      );

      let newitem = {
        promotion: listPromotion[i],
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
      promotion.push(newitem);
    }
    if (req.session.loggedin && req.session.user) {
      // Lấy thông tin người dùng từ đối tượng session
      const loggedInUser = req.session.user;

      return res.render("Voucher", {
        user: loggedInUser,
        data: promotion,
        search: _name,
        totalPage: totalPage,
        name: _name,
        page: _page,
        limit: _limit,

        //return res.status(200).json({ status: 200, data: listProduct });
      });
    }
  } catch (error) {
    console.log(error);
    return res.render("Voucher", {
      data: [],
      message: "Internal server error",
    });
  }
};
exports.indexaddPromotion = async (req, res, next) => {
  if (req.session.loggedin && req.session.user) {
    // Lấy thông tin người dùng từ đối tượng session
    const loggedInUser = req.session.user;
    res.render("addVoucher", { user: loggedInUser });
  }
};
exports.createPromotion = async (req, res) => {
  const { name, image, discount, startDate, endDate, quantity } = req.body;
  const imageFlie = req.file;
  try {
    if (
      !name ||
      (!image && !imageFlie) ||
      !discount ||
      !startDate ||
      !endDate
    ) {
      if (imageFlie) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    let imageUrl = "";
    if (imageFlie) {
      const result = await cloudinary.uploader.upload(imageFlie.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }
    const newpromotion = {
      name,
      image: imageUrl,
      discount,
      startDate,
      endDate,
      quantity,
    };
    console.log(newpromotion);
    const createPromotion = await Promotion.create(newpromotion);

    let title = "Thông báo!";
    let content = "Đang có voucher mới cùng vào mua sắm nào!!!!!";
    // Assuming AccountIds is an array of user IDs
    // Fetch FCM tokens for all users
    const users = await Account.findAll();
    const registrationTokens = users.map((user) => user.fcmToken);
    const message = {
      notification: {
        title: title,
        body: content,
      },
      android: {
        notification: {
          imageUrl:
            "https://res.cloudinary.com/dj9kuswbx/image/upload/v1701677696/ehpkgf7liptimndzhitp.jpg",
        },
      },
      registration_ids: registrationTokens,
    };
    // Send the notification to all users
    fcm.send(message, async (err, response) => {
      if (err) {
        console.error("Error sending multicast message:", err);
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      }
      // Save the notification in the Notify model for each user
      const notifications = registrationTokens.map((token, index) => ({
        title: title,
        content: content,
        AccountId: users[index].id,
        VoucherId: createPromotion.id,
        imageVoucher: imageUrl,
      }));
      await notifyAccount.bulkCreate(notifications);
      console.log("Successfully sent multicast message:", response);
    });
    return res.redirect("/voucher");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updatePromotion = async (req, res) => {
  const promotionID = req.params.id;
  const { name, image, description, discount, startDate, endDate } = req.body;
  const imageFlie = req.file;
  const promotion = await Promotion.findByPk(promotionID);
  try {
    if (!promotion) {
      return res
        .status(400)
        .json({ status: 400, message: "Promotion not found" });
    }
    let imageUrl = promotion.image;
    if (imageFlie) {
      const result = await cloudinary.uploader.upload(imageFlie.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }
    const updatePromotion = {
      name,
      image: imageUrl,
      description,
      discount,
      startDate,
      endDate,
    };
    const Promotions = await Promotion.update(updatePromotion, {
      where: { id: promotionID },
    });
    if (Promotions) {
      return res.status(200).json({ status: 200, data: Promotions });
    } else {
      return res
        .status(400)
        .json({ status: 500, message: "Updaate promotion false" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deletePromotion = async (req, res) => {
  const promotionID = req.params.id;
  const promotion = Promotion.findByPk(promotionID);
  if (!promotion) {
    return res.status(404).json({ status: 404, message: "Category not found" });
  }
  const deletePromotion = await Promotion.destroy({
    where: {
      id: promotionID,
    },
  });
  if (deletePromotion) {
    return res.redirect("/voucher");
  } else {
    return res
      .status(500)
      .json({ status: 500, message: "Error connecting to database" });
  }
};

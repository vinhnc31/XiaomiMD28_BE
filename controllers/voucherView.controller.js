const cloudinary = require("cloudinary").v2;
const { async } = require("@firebase/util");
const { Promotion } = require("../models");
const moment = require("moment");
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
    let totalPage = Math.ceil(totalRow / _limit);
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

    return res.render("Voucher", {
      data: promotion,
      search: _name,
      totalPage: totalPage,
      name: _name,
      page: _page,
      limit: _limit,

      //return res.status(200).json({ status: 200, data: listProduct });
    });
  } catch (error) {
    console.log(error);
    return res.render("Voucher", {
      data: [],
      message: "Internal server error",
    });
  }
};
exports.indexaddPromotion = async (req, res, next) => {
  res.render("addVoucher");
};
exports.createPromotion = async (req, res) => {
  const { name, image, discount, startDate, endDate } = req.body;
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
    };
    console.log(newpromotion);
    const createPromotion = await Promotion.create(newpromotion);

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

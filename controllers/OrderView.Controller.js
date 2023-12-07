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
} = require("../models/index");
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
        include: {
          model: Account,
        },
        offset: _start,
        limit: _limit,
        order: [["id", "DESC"]],
      });
    }
    let newlist = [];
    for (let i = 0; i < listOrder.length; i++) {
      console.log(listOrder[i].id);
      const listprodut = await OrdersProduct.findAll({
        where: {
          OrderId: listOrder[i].id,
        },
      });
      const address = await Address.findOne({
        where: {
          id: listOrder[i].AddressId,
        },
      });

      let newlistproduct = [];
      for (let i = 0; i < listprodut.length; i++) {
        let namecolor = "";
        let nameconfig = "";

        console.log(listprodut[i].id);
        const product = await Product.findOne({
          where: {
            id: listprodut[i].productId,
          },
        });
        if (listprodut[i].ProductColorId === null) {
          namecolor = "Mặc định";
        } else {
          const color = await productcolor.findOne({
            where: {
              id: listprodut[i].ProductColorId,
            },
            include: [
              {
                model: Color,
              },
            ],
          });
          namecolor = color.Color.nameColor;
        }
        if (listprodut[i].ProductColorConfigId === null) {
          nameconfig = "Mặc định";
        } else {
          const config = await ProductColorConfig.findOne({
            where: {
              id: listprodut[i].ProductColorConfigId,
            },
            include: [
              {
                model: Config,
              },
            ],
          });
          nameconfig = config.Config.nameConfig;
        }
        let newitem = {
          id: product.id,
          name: product.name,
          image: product.image,
          quantity: listprodut[i].quantity,
          price: product.price,
          color: namecolor,
          config: nameconfig,
        };
        newlistproduct.push(newitem);
      }

      let neworder = {
        address: address,
        order: listOrder[i],
        listproduct: newlistproduct,
      };
      newlist.push(neworder);
    }

    return res.render("Order", {
      data: newlist,
      search: _name,
      totalPage: totalPage,
      name: _name,
      page: _page,
      status: -1,

      //return res.status(200).json({ status: 200, data: newlist });
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
        offset: _start,
        limit: _limit,
        include: {
          model: Account,
        },
      });
    } else {
      listOrder = await Orders.findAll({
        where: {
          status: status,
        },
        include: {
          model: Account,
        },
        offset: _start,
        limit: _limit,
        order: [["id", "DESC"]],
      });
    }
    let newlist = [];
    for (let i = 0; i < listOrder.length; i++) {
      console.log(listOrder[i].id);
      const listprodut = await OrdersProduct.findAll({
        where: {
          OrderId: listOrder[i].id,
        },
      });
      const address = await Address.findOne({
        where: {
          id: listOrder[i].AddressId,
        },
      });

      let newlistproduct = [];
      for (let i = 0; i < listprodut.length; i++) {
        let namecolor = "";
        let nameconfig = "";

        console.log(listprodut[i].id);
        const product = await Product.findOne({
          where: {
            id: listprodut[i].productId,
          },
        });
        if (listprodut[i].ProductColorId === null) {
          namecolor = "Mặc định";
        } else {
          const color = await productcolor.findOne({
            where: {
              id: listprodut[i].ProductColorId,
            },
            include: [
              {
                model: Color,
              },
            ],
          });
          namecolor = color.Color.nameColor;
        }
        if (listprodut[i].ProductColorConfigId === null) {
          nameconfig = "Mặc định";
        } else {
          const config = await ProductColorConfig.findOne({
            where: {
              id: listprodut[i].ProductColorConfigId,
            },
            include: [
              {
                model: Config,
              },
            ],
          });
          nameconfig = config.Config.nameConfig;
        }
        let newitem = {
          id: product.id,
          name: product.name,
          image: product.image,
          quantity: listprodut[i].quantity,
          price: product.price,
          color: namecolor,
          config: nameconfig,
        };
        newlistproduct.push(newitem);
      }

      let neworder = {
        address: address,
        order: listOrder[i],
        listproduct: newlistproduct,
      };
      newlist.push(neworder);
    }

    return res.render("Order", {
      data: newlist,
      search: _name,
      totalPage: totalPage,
      name: _name,
      page: _page,
      status: status,

      //return res.status(200).json({ status: 200, data: newlist });
    });
  } catch (error) {
    console.log(error);
  }
};
exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;
  try {
    const whereId = await Orders.findByPk(id);

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

    return res.redirect("/order/choxacnhan");
    //return res.status(200).json({ status: 200, message: "update thành công" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

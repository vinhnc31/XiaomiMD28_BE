const {
  Orders,
  OrdersProduct,
  Address,
  Account,
  Product,
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
        console.log(listprodut[i].id);
        const item = await Product.findOne({
          where: {
            id: listprodut[i].productId,
          },
        });

        let newitem = {
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: listprodut[i].quantity,
          price: item.price,
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

      //return res.status(200).json({ status: 200, data: newlist });
    });
  } catch (error) {
    console.log(error);
  }
};

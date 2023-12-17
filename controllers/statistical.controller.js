const {
  Product,
  Staff,
  Orders,
  OrdersProduct,
  Internals,
  productcolor,
  Account,
  Color,
  ProductColorConfig,
  Config,
  Category,
} = require("../models");
const { Op, fn, col, literal } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const totalStaff = await Staff.count("id");
    const totalProduct = await Product.count("id");
    const totalOrder = await Orders.count("id");
    const totalRevenue = await Orders.sum("total");
    const totalOrderCancellation = await Orders.count({ where: { status: 3 } });
    const totalProhibitedStaff = await Internals.count({
      where: { status: 1 },
    });

    const listFilterSelling = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ["name"],
        },
        {
          model: productcolor,
          as: "colorProducts",
          include: [
            {
              model: Color,
            },
            {
              model: ProductColorConfig,
              as: "colorConfigs",
              include: [
                {
                  model: Config,
                },
              ],
            },
          ],
        },
        {
          model: OrdersProduct,
          as: "OrdersProducts",
        },
      ],
      attributes: [
        "id",
        "name",
        "price",
        "images",
        [fn("COUNT", col("OrdersProducts.id")), "ordersCount"], // Count orders for each product
      ],
      order: [[literal("ordersCount"), "DESC"]],
      subQuery: false,
      group: ["Product.id"],
      limit: 10,
    });

    if (!listFilterSelling) {
      return res
        .status(404)
        .json({ status: 400, message: "connect fail database" });
    }

    const listFilterOutOfStock = await Product.findAll({
      include: [
        {
          model: productcolor,
          as: "colorProducts",
          include: [
            {
              model: Color,
            },
            {
              model: ProductColorConfig,
              as: "colorConfigs",
              include: [
                {
                  model: Config,
                },
              ],
              // where: { quantity: 0 },
            },
          ],
        },
        {
          model: Category,
          where: {
            name: {
              [Op.not]: "Điện thoại",
            },
          },
        },
      ],
      where: { quantity: 0 },
      group: ["Product.id"],
      limit: 10,
    });

    const listOrder = await Orders.findAll({
      include: [
        {
          model: Account,
          attributes: {
            exclude: [
              "password",
              "updatedAt",
              "createdAt",
              "deletedAt",
              "fcmToken",
              "verified",
            ],
          },
        },
        {
          model: OrdersProduct,
          separate: true,
          include: [
            {
              model: Product,
              attributes: {
                exclude: ["description", "updatedAt", "createdAt", "deletedAt"],
              },
            },
            { model: productcolor },
            { model: ProductColorConfig },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const listStaff = await Staff.findAll({
      order: [["createdAt", "DESC"]], // Order by createdAt in descending order (latest first)
      limit: 10, // Limit the result to 10 records
    });

    if (req.session.loggedin && req.session.user) {
      const loggedInUser = req.session.user;

      res.render("salesReport", {
        totalStaff,
        totalProduct,
        totalOrder,
        totalRevenue,
        totalOrderCancellation,
        totalProhibitedStaff,
        dataStaff: listStaff,
        dataSelling: listFilterSelling,
        dataOutOfStock: listFilterOutOfStock,
        dataOrder: listOrder,
        user: loggedInUser,
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getRevenueInMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfLast6Months = new Date();
    startOfLast6Months.setMonth(currentDate.getMonth() - 11);
    const revenueByMonth = [];
    for (
      let month = startOfLast6Months.getMonth();
      month <= currentDate.getMonth();
      month++
    ) {
      const startOfMonth = new Date(currentDate.getFullYear(), month, 1);
      const endOfMonth = new Date(currentDate.getFullYear(), month + 1, 0);

      const importProductCountByStatus = await Product.sum("importPrice", {
        where: {
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      const orderCountByStatus = await Orders.sum("total", {
        where: {
          status: "2",
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      const revenue = orderCountByStatus - importProductCountByStatus;
      const monthOrderData = {
        month: startOfMonth.getMonth() + 1,
        expense: importProductCountByStatus || 0,
        revenue: revenue || 0,
      };
      revenueByMonth.push(monthOrderData);
    }

    if (revenueByMonth.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No revenue data found" });
    }
    return res.status(200).json({
      status: 200,
      data: revenueByMonth,
    });
  } catch (error) {
    console.error("Error fetching revenue statistics:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getChartProductSel = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfLast6Months = new Date();
    startOfLast6Months.setMonth(currentDate.getMonth() - 5);

    const totalOrders = await OrdersProduct.count({
      where: {
        createdAt: {
          [Op.gte]: startOfLast6Months,
          [Op.lte]: currentDate,
        },
      },
    });

    if (totalOrders === 0) {
      return res.status(200).json({ status: 200, data: [] });
    }

    const categories = await Category.findAll({
      attributes: ["id", "name"],
    });

    const categoryData = await Promise.all(
      categories.map(async (category) => {
        const ordersCount = await Product.count({
          include: [
            {
              model: OrdersProduct,
              as: "OrdersProducts",
              where: {
                createdAt: {
                  [Op.gte]: startOfLast6Months,
                  [Op.lte]: currentDate,
                },
              },
            },
          ],
          where: {
            CategoryId: category.id,
          },
        });
        const percentage = (ordersCount / totalOrders) * 100;
        return {
          id: category.id,
          name: category.name,
          percentage,
        };
      })
    );

    return res.status(200).json({ status: 200, data: categoryData });
  } catch (error) {
    console.error("Error fetching categories and orders:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

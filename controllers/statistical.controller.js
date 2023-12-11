const {
  Product,
  Staff,
  Orders,
  OrdersProduct,
  Internals,
  productcolor,
  Color,
  ProductColorConfig,
  Config,
  Category,
} = require("../models");
const { Op, fn, col, literal } = require("sequelize");
exports.getStaff = async (req, res) => {
  try {
    const totalStaff = await Staff.count("id");
    console.log(totalAccount);
    if (!totalAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalStaff: totalStaff });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const totalProduct = await Product.count("id");
    console.log(totalAccount);
    if (!totalAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalProduct: totalProduct });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const totalOrder = await Orders.count("id");
    console.log(totalAccount);
    if (!totalAccount) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalOrder: totalOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const totalOrder = await Orders.sum("total");
    console.log(totalOrder);
    if (!totalOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalOrder: totalOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getOrderNew = async (req, res) => {
  try {
    const listOrder = await Orders.findAll({
      include: [{ model: OrdersProduct }],
      order: [["createdAt", "DESC"]],
    });
    if (!listOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, data: listOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getOrderCancellation = async (req, res) => {
  try {
    const totalOrder = await Orders.count({ where: { status: 3 } });
    console.log(totalOrder);
    if (!totalOrder) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalOrder: totalOrder });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getProhibitedStaff = async (req, res) => {
  try {
    const totalStaff = await Internals.count({ where: { status: 1 } });
    if (!totalStaff) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, totalStaff: totalStaff });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getProductSelling = async (req, res) => {
  try {
    const listFilter = await Product.findAll({
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
      group: ["Product.id"],
    });

    console.log(listFilter);

    if (!listFilter) {
      return res
        .status(400)
        .json({ status: 400, message: "Failed to connect to the database" });
    }

    return res.status(200).json({ status: 200, data: listFilter });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getProductIsOutOfStock = async (req, res) => {
  try {
    const listFilter = await Product.findAll({
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
              where: { quantity: 0 },
            },
          ],
        },
      ],
      group: ["Product.id"],
      limit: 10,
    });

    console.log(listFilter);

    if (!listFilter) {
      return res
        .status(404)
        .json({ status: 400, message: "connect fail database" });
    }

    return res.status(200).json({ status: 200, data: listFilter });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getStaffNew = async (req, res) => {
  try {
    const listStaff = await Staff.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    if (!listStaff) {
      return res.status(400).json({ status: 400, message: "No staff found" });
    }

    return res.status(200).json({ status: 200, data: listStaff });
  } catch (error) {
    console.error(error);
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
    // Generate the list of months starting from 5 months ago until the current month
    for (
      let month = startOfLast6Months.getMonth();
      month <= currentDate.getMonth();
      month++
    ) {
      // Tạo ngày bắt đầu và ngày kết thúc của tháng hiện tại
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

      // Tạo đối tượng chứa thông tin tháng và số lượng đơn hàng
      const monthOrderData = {
        month: startOfMonth.getMonth() + 1,
        expense: importProductCountByStatus || 0,
        revenue: revenue || 0,
      };

      // Lưu đối tượng vào mảng orderData
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
    const listFilter = await Product.findAll({
      include: [
        {
          model: Category,
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
      where: {
        createdAt: {
          [Op.gte]: startOfLast6Months,
          [Op.lte]: currentDate,
        },
      },
      order: [[literal("ordersCount"), "DESC"]],
      group: ["Product.id"],
    });

    console.log(listFilter);

    if (!listFilter) {
      return res
        .status(400)
        .json({ status: 400, message: "Failed to connect to the database" });
    }

    return res.status(200).json({ status: 200, data: listFilter });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

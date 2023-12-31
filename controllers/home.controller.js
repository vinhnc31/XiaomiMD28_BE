const { Account, Product, Staff, Orders } = require("../models");
const { Op } = require("sequelize");

exports.getAllData = async (req, res) => {
  try {
    const totalAccount = await Account.count("id");
    const totalProduct = await Product.count("id");
    const totalOrder = await Orders.count("id");
    const totalStaff = await Staff.count("id");

    const listAccount = await Account.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    const listOrder = await Orders.findAll({
      include: [{ model: Account, as: "account" }],
      order: [["createdAt", "DESC"]],
      limit: 10,
    });

    if (
      !totalAccount ||
      !totalProduct ||
      !totalOrder ||
      !totalStaff ||
      !listAccount ||
      !listOrder
    ) {
      return res.status(400).json({
        status: 400,
        message: "Connect fail database or data not found",
      });
    }
    console.log(listOrder);

    if (req.session.loggedin && req.session.user) {
      // Lấy thông tin người dùng từ đối tượng session
      const loggedInUser = req.session.user;

      res.render("home", {
        totalAccount: totalAccount,
        totalProduct: totalProduct,
        totalOrder: totalOrder,
        totalStaff: totalStaff,
        listAccount: listAccount,
        listOrder: listOrder,
        user: loggedInUser,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.getOrderInMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfLast6Months = new Date();
    startOfLast6Months.setMonth(currentDate.getMonth() - 5);

    // Tạo một mảng để lưu trữ số lượng đơn hàng theo từng tháng và tổng số lượng
    const orderData = [];

    // Lặp qua từng tháng trong khoảng 6 tháng gần đây
    for (
      let month = startOfLast6Months.getMonth();
      month <= currentDate.getMonth();
      month++
    ) {
      // Tạo ngày bắt đầu và ngày kết thúc của tháng hiện tại
      const startOfMonth = new Date(currentDate.getFullYear(), month, 1);
      const endOfMonth = new Date(currentDate.getFullYear(), month + 1, 0);

      // Đếm số lượng đơn hàng theo từng trạng thái trong tháng hiện tại
      const orderCountByStatus = await Orders.count({
        where: {
          status: 0,
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });
      const orderCountByStatus1 = await Orders.count({
        where: {
          status: 1,
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });
      const orderCountByStatus2 = await Orders.count({
        where: {
          status: 2,
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });
      const orderCountByStatus3 = await Orders.count({
        where: {
          status: 3,
          createdAt: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      // Tạo đối tượng chứa thông tin tháng và số lượng đơn hàng
      const monthOrderData = {
        month: startOfMonth.getMonth() + 1, // Tháng được đánh số từ 0 đến 11, nên cộng 1 để đúng với tháng thực tế
        totalOrder: {
          orderCountByStatus,
          orderCountByStatus1,
          orderCountByStatus2,
          orderCountByStatus3,
        },
      };

      // Lưu đối tượng vào mảng orderData
      orderData.push(monthOrderData);
    }

    return res.status(200).json({
      status: 200,
      data: orderData,
    });
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.getRevenueInMonth = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfLast6Months = new Date();
    startOfLast6Months.setMonth(currentDate.getMonth() - 5);
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
      console.log(orderCountByStatus, "aa");

      const revenue =
        Number(orderCountByStatus) - Number(importProductCountByStatus);

      // Tạo đối tượng chứa thông tin tháng và số lượng đơn hàng
      const monthOrderData = {
        month: startOfMonth.getMonth() + 1,
        expense: importProductCountByStatus || 0,
        profit: revenue || 0,
        revenue: orderCountByStatus || 0,
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

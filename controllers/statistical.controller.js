const {
  Product,
  Staff,
  Orders,
  Internals,
  productcolor,
  Color,
  ProductColorConfig,
  Config,
} = require("../models");
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
              order: [["quantity", "DESC"]],
            },
          ],
        },
      ],
      group: ["Product.id"],
      limit: 10,
    });

    console.log(listFilter);

    if (!listFilter || listFilter.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: "No products found" });
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

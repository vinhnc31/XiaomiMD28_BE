const sequelize = require("sequelize");
const cloudinary = require("cloudinary").v2;
const {
  Product,
  productcolor,
  Color,
  Category,
  ProductColorConfig,
  Config,
  Comment,
} = require("../models");

const { Op, fn, col, literal } = require("sequelize");

exports.getProduct = async (req, res) => {
  try {
    const name = req.query.name;
    let listProduct;
    if (name) {
      listProduct = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`, // Using 'like' for a partial match
          },
        },
        include: [{ model: Comment, as: "comments" }],
        attributes: [
          "id",
          "name",
          "price",
          "description",
          "createdAt",
          "updatedAt",
          "CategoryId",
          [fn("COUNT", col("comments.id")), "commentCount"],
          [
            literal(
              "ROUND(IFNULL(SUM(comments.star), 0) / NULLIF(COUNT(comments.id), 0), 2)"
            ),
            "averageRating",
          ],
        ],
        group: ["Product.id"],
      });
    } else {
      listProduct = await Product.findAll({
        include: [{ model: Comment, as: "comments" }],
        attributes: [
          "id",
          "name",
          "price",
          "description",
          "createdAt",
          "updatedAt",
          "CategoryId",
          [fn("COUNT", col("comments.id")), "commentCount"],
          [
            literal(
              "ROUND(IFNULL(SUM(comments.star), 0) / NULLIF(COUNT(comments.id), 0), 2)"
            ),
            "averageRating",
          ],
        ],
        group: ["Product.id"],
      });
    }

    if (!listProduct) {
      return res
        .status(400)
        .json({ status: 400, message: "false connecting db" });
    }
    return res.status(200).json({ status: 200, data: listProduct });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getFilter = async (req, res) => {
  const { minPrice, maxPrice, categoryId } = req.query;
  try {
    const whereCondition = {};

    if (minPrice || maxPrice) {
      whereCondition.price = {};

      if (minPrice) {
        whereCondition.price[Op.gte] = minPrice;
      }

      if (maxPrice) {
        whereCondition.price[Op.lte] = maxPrice;
      }
    }

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    const listProduct = await Product.findAll({
      where: whereCondition,
      include: [{ model: Comment, as: "comments" }],
      attributes: [
        "id",
        "name",
        "price",
        "description",
        "createdAt",
        "updatedAt",
        "CategoryId",
        [fn("COUNT", col("comments.id")), "commentCount"],
        [
          literal(
            "ROUND(IFNULL(SUM(comments.star), 0) / NULLIF(COUNT(comments.id), 0), 2)"
          ),
          "averageRating",
        ],
      ],
      group: ["Product.id"],
    });

    if (!listProduct) {
      return res
        .status(400)
        .json({ status: 400, message: "false connecting db" });
    }

    return res.status(200).json({ status: 200, data: listProduct });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.getProductId = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if ID is provided
    if (!id) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    }
    const product = await Product.findOne({
      where: { id: id },
      include: [
        {
          model: productcolor,
          as: "colorProducts",
          separate: true,
          include: [
            {
              model: Color,
            },
            {
              model: ProductColorConfig,
              as: "colorConfigs",
              include: [
                {
                  model: Config, // Adjust this based on your actual association
                },
              ],
            },
          ],
        },
        { model: Comment, as: "comments" },
      ],
      attributes: [
        "id",
        "name",
        "price",
        "description",
        "createdAt",
        "updatedAt",
        "CategoryId",
        [fn("COUNT", col("comments.id")), "commentCount"],
        [
          literal(
            "ROUND(IFNULL(SUM(comments.star), 0) / NULLIF(COUNT(comments.id), 0), 2)"
          ),
          "averageRating",
        ],
      ],
      group: ["Product.id", "comments.id"],
    });
    if (!product) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    }

    // Return the product data
    return res.status(200).json({ status: 200, data: product });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.getCategoryID = async (req, res) => {
  try {
    const categoryID = +req.params.CategoryId;
    console.log(categoryID);
    if (!categoryID) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }
    const product = await Product.findAll({
      where: { CategoryId: categoryID },
      raw: true,
    });
    console.log(product);
    if (!product) {
      return res
        .status(404)
        .json({ status: 404, message: "Category not found" });
    }
    return res.status(200).json({ status: 200, data: product });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.addCategory = async (req, res) => {
  try {
    const { name, price, description, CategoryId, images } = req.body;
    const fileData = req.files; // Use req.files for multiple files

    if (!name || !price || (!images && !fileData)) {
      // Handle other required fields

      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }

    const category = await Category.findByPk(CategoryId);

    if (!category) {
      return res.status(400).json({
        status: 400,
        message: "CategoryId is a required field",
      });
    }

    let imageUrl = "";
    if (fileData) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(fileData.path);
      imageUrl = result.secure_url;
    } else if (images) {
      imageUrl = images;
    }
    const product = {
      name,
      images: imageUrl, // Store multiple image URLs as a comma-separated string or an array in your database
      price,
      description,
      CategoryId,
    };

    const addProduct = await Product.create(product);

    if (!addProduct) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to the database" });
    }

    return res.status(201).json({ status: 201, data: addProduct });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const product = await Product.findByPk(productID);

    if (!product) {
      return res
        .status(404)
        .json({ status: 404, message: "Product not found" });
    }

    const deleteProduct = await product.destroy();

    if (!deleteProduct) {
      return res
        .status(400)
        .json({ status: 400, message: "false connexting db" });
    }
    return res.status(200).json({ status: 200, message: "delete successfuly" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getFilterInColor = async (req, res) => {
  const { color } = req.query;
  const categoryId = +req.query.categoryId;
  try {
    const listFilter = await Product.findAll({
      include: [
        {
          model: productcolor,
          as: "colorProducts",
          include: [
            {
              model: Color,
              where: { nameColor: color },
            },
            {
              model: ProductColorConfig,
              as: "colorConfigs",
              include: [
                {
                  model: Config, // Adjust this based on your actual association
                },
              ],
            },
          ],
        },
        { model: Comment, as: "comments" },
      ],
      where: {
        "$colorProducts.colorId$": { [Op.ne]: null }, // Only include products with the specified color
        categoryId: categoryId,
      },
      attributes: [
        "id",
        "name",
        "price",
        "description",
        "createdAt",
        "updatedAt",
        "CategoryId",
        [fn("COUNT", col("comments.id")), "commentCount"],
        [
          literal(
            "ROUND(IFNULL(SUM(comments.star), 0) / NULLIF(COUNT(comments.id), 0), 2)"
          ),
          "averageRating",
        ],
      ],
      group: ["Product.id"],
    });
    if (!listFilter) {
      return res
        .status(400)
        .json({ status: 400, message: "false connexting db" });
    }
    return res.status(200).json({ status: 200, data: listFilter });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getFilterInConfig = async (req, res) => {
  const { config } = req.query;
  const categoryId = +req.query.categoryId;
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
                  where: { nameConfig: config }, // Adjust this based on your actual association
                },
              ],
            },
          ],
        },
        { model: Comment, as: "comments" },
      ],
      where: {
        "$colorProducts.colorConfigs.configId$": { [Op.ne]: null }, // Only include products with the specified color
        categoryId: categoryId,
      },
      attributes: [
        "id",
        "name",
        "price",
        "description",
        "createdAt",
        "updatedAt",
        "CategoryId",
        [fn("COUNT", col("comments.id")), "commentCount"],
        [
          literal(
            "ROUND(IFNULL(SUM(comments.star), 0) / NULLIF(COUNT(comments.id), 0), 2)"
          ),
          "averageRating",
        ],
      ],
      group: ["Product.id"],
    });
    if (!listFilter) {
      return res.status(400).json({ status: 400, message: "false connext db" });
    }
    return res.status(200).json({ status: 200, data: listFilter });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getFilterInPrice = async (req, res) => {
  const sortPrice = +req.query.sortPrice;
  const categoryId = +req.query.categoryId;
  let order = [["price", "ASC"]];
  console.log(order);
  if (sortPrice) {
    order = [["price", sortPrice === 1 ? "ASC" : "DESC"]];
  }
  try {
    const listProduct = await Product.findAll({
      order,
      where: { categoryId: categoryId },
      include: [{ model: Comment, as: "comments" }],
      attributes: [
        "id",
        "name",
        "price",
        "description",
        "createdAt",
        "updatedAt",
        "CategoryId",
        [fn("COUNT", col("comments.id")), "commentCount"],
        [
          literal(
            "ROUND(IFNULL(SUM(comments.star), 0) / NULLIF(COUNT(comments.id), 0), 2)"
          ),
          "averageRating",
        ],
      ],
      group: ["Product.id"],
    });

    if (!listProduct) {
      return res.status(400).json({ status: 400, message: "false connext db" });
    }
    return res.status(200).json({ status: 200, data: listProduct });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getFilterInStart = async (req, res) => {
  try {
    const listProduct = await Product.findAll({
      include: [{ model: Comment, as: "comments" }],
      attributes: [
        "id",
        "name",
        "price",
        "description",
        "createdAt",
        "updatedAt",
        "CategoryId",
        [fn("COUNT", col("comments.id")), "commentCount"],
        [
          literal(
            "ROUND(IFNULL(SUM(comments.star), 0) / NULLIF(COUNT(comments.id), 0), 2)"
          ),
          "averageRating",
        ],
      ],
      group: ["Product.id"],
      order: [[literal("averageRating"), "DESC"]], // Order by averageRating in descending order
    });
    if (!listProduct) {
      return res
        .status(400)
        .json({ status: 400, message: "false connecting db" });
    }
    return res.status(200).json({ status: 200, data: listProduct });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

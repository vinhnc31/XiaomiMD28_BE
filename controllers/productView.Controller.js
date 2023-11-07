const cloudinary = require("cloudinary").v2;
const { name } = require("ejs");
const { Product, Category, Color } = require("../models");
const { Op } = require("sequelize");
exports.index = async (req, res) => {
  try {
    const _name = req.query.name;
    //lấy trang hiện tại
    let _page = req.query.page ? req.query.page : 1;
    let listProduct = [];

    let _limit = 2;
    let totalRow = await Product.count();
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;
    // const list = [
    //   {
    //     id: "fef",
    //     name: "dădw",
    //   },
    // ];
    // return res.render("product", {
    //   data: list,
    // });
    if (_name) {
      listProduct = await Product.findAll({
        include: [
          {
            model: Category,
          },
        ],
        where: {
          name: { [Op.like]: `%${_name}%` },
        },
        offset: _start,
        limit: _limit,
      });
    } else {
      listProduct = await Product.findAll({
        include: [
          {
            model: Category,
          },
        ],
        offset: _start,
        limit: _limit,
      });
    }

    return res.render("product", {
      data: listProduct,
      search: _name,
      totalPage: totalPage,
      name: _name,
      page: _page,

      //return res.status(200).json({ status: 200, data: listProduct });
    });
  } catch (error) {
    console.log(error);
    return res.render("product", {
      data: [],
      message: "Internal server error",
    });
  }
};

exports.indexAddProduct = async (req, res) => {
  const listCategory = await Category.findAll();
  if (listCategory) {
  } else {
    res.status(400).json({ status: 400, message: "false connexting db" });
  }
  res.render("addProduct", {
    category: listCategory,
    title: "Thêm sản phẩm",
    product: [
      {
        name: "",
        price: "",
        quantity: "",
        images: "",
        description: "",
        CategoryId: [
          {
            name: "",
          },
        ],
      },
    ],
  });
};

exports.addProduct = async (req, res) => {
  try {
    const { name, images, price, description, quantity, CategoryId } = req.body;
    console.log(req.body);
    const filedata = req.file;
    console.log(filedata);

    // if (!name || (!images && !filedata) || !price || !quantity || !CategoryId) {
    //   if (filedata) {
    //     // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
    //     cloudinary.uploader.destroy(filedata.filename);
    //   }
    //   return res
    //     .status(400)
    //     .json({ status: 400, message: "Fields cannot be left blank" });
    // }
    // // Check if CategoryId and PromotionId are defined
    // if (!CategoryId) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "CategoryId are required fields",
    //   });
    // }

    let imageUrl = "";
    if (filedata) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(filedata.path);
      imageUrl = result.secure_url;
    } else if (images) {
      imageUrl = images;
    }

    const product = {
      name,
      images: imageUrl,
      price,
      description,
      quantity,
      CategoryId,
    };

    const addProduct = await Product.create(product);
    console.log(addProduct);
    if (!addProduct) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.redirect("/products");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  const productID = req.params.id;
  const product = Product.findByPk(productID);
  if (!product) {
    res.status(404).json({ status: 404, message: "Product not found" });
  }
  const deleteCategory = await Product.destroy({
    where: {
      id: productID,
    },
  });
  if (deleteCategory) {
    res.redirect("/products");
  } else {
    res.status(400).json({ status: 400, message: "false connexting db" });
  }
};
exports.indexUpdateProduct = async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findOne({
    where: {
      id: id,
    },
  });
  const listCategory = await Category.findAll();
  if (listCategory) {
  } else {
    res.status(400).json({ status: 400, message: "false connexting db" });
  }

  res.render("updateProduct", {
    category: listCategory,
    product: product,
    title: "Sửa sản phẩm",
  });
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ where: { id: id } });
    const { name, images, price, description, quantity, CategoryId } = req.body;
    console.log(req.body);
    const filedata = req.file;

    let imageUrl = product.images;
    if (filedata) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(filedata.path);
      imageUrl = result.secure_url;
    } else if (images) {
      imageUrl = images;
    }

    const updateProduct = {
      name,
      images: imageUrl,
      price,
      description,
      quantity,
      CategoryId,
    };

    const update = await Product.update(updateProduct, {
      where: {
        id: id,
      },
    });
    console.log(update);
    if (!update) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.redirect("/products");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.addCategory = async (req, res) => {
  try {
    const { newCategory } = req.body;

    const category = { name: newCategory };
    const addCategory = await Category.create(category);

    if (addCategory) {
      return res.redirect("/products/add");
    } else {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.indexColorProduct = async (req, res, next) => {
  try {
    const listColor = await Color.findAll();

    res.render("colorsProduct", {
      color: listColor,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.addColor = async (req, res, next) => {
  const { newColor } = req.body;
  try {
    const addColor = await Color.create({ name: newColor });

    return res.redirect("/products/add/colorProduct");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

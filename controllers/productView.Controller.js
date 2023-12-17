const cloudinary = require("cloudinary").v2;
const { name } = require("ejs");
const {
  Product,
  Category,
  Color,
  ProductColorConfig,
  Config,
  productcolor,
} = require("../models");
const { Op } = require("sequelize");
exports.index = async (req, res) => {
  try {
    let _name = req.query.name;
    console.log(_name);

    if (!_name) {
      _name = "";
    }

    let _page = req.query.page ? req.query.page : 1;
    let listProduct = [];
    let _limit = Number(req.query.limit ? req.query.limit : 10);
    let totalRow = 0;
    let totalPage = 0;
    if (_name) {
      totalRow = await Product.count({
        where: {
          name: { [Op.like]: `%${_name}%` },
        },
      });
      totalPage =
        Math.ceil(totalRow / _limit) > 0 ? Math.ceil(totalRow / _limit) : 1;
      _page = _page > 0 ? Math.floor(_page) : 1;
      _page = _page <= totalPage ? Math.floor(_page) : totalPage;
      let _start = (_page - 1) * _limit;
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
      totalRow = await Product.count();
      totalPage =
        Math.ceil(totalRow / _limit) > 0 ? Math.ceil(totalRow / _limit) : 1;
      _page = _page > 0 ? Math.floor(_page) : 1;
      _page = _page <= totalPage ? Math.floor(_page) : totalPage;
      let _start = (_page - 1) * _limit;
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
    const category = await Category.findAll();
    if (req.session.loggedin && req.session.user) {
      // Lấy thông tin người dùng từ đối tượng session
      const loggedInUser = req.session.user;

      return res.render("product", {
        cate: 0,
        category: category,
        data: listProduct,
        search: _name,
        totalPage: totalPage,
        name: _name,
        page: _page,
        limit: _limit,
        user: loggedInUser,

        //return res.status(200).json({ status: 200, data: listProduct });
      });
    }
  } catch (error) {
    console.log(error);
    return res.render("product", {
      data: [],
      message: "Internal server error",
    });
  }
};

exports.indexAddProduct = async (req, res) => {
  console.log("fffffffffffffffffffffffffff");
  const listCategory = await Category.findAll();

  if (!listCategory) {
    res.status(400).json({ status: 400, message: "afalse connexting db" });
  }
  if (req.session.loggedin && req.session.user) {
    // Lấy thông tin người dùng từ đối tượng session
    const loggedInUser = req.session.user;
    res.render("addProduct", {
      user: loggedInUser,
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
  }
};

exports.addProduct = async (req, res) => {
  const filedata = req.file;
  try {
    const {
      name,
      images,
      price,
      description,
      CategoryId,
      importPrice,
      quantity,
    } = req.body;
    console.log(req.body);
    if (!name || (!images && !filedata) || !price || !CategoryId) {
      if (filedata) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }

    console.log(filedata);
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
      CategoryId,
      importPrice,
      quantity,
    };

    const addProduct = await Product.create(product);
    console.log(addProduct);
    if (!addProduct) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }

    return res.redirect("/products/add/colorProduct/" + addProduct.id);
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
    res.status(400).json({ status: 400, message: "afalse connexting db" });
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
    return res
      .status(400)
      .json({ status: 400, message: "afalse connexting db" });
  }
  if (req.session.loggedin && req.session.user) {
    // Lấy thông tin người dùng từ đối tượng session
    const loggedInUser = req.session.user;

    res.render("updateProduct", {
      category: listCategory,
      product: product,
      title: "Sửa sản phẩm",
      user: loggedInUser,
    });
  }
  //res.status(200).json(product);
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ where: { id: id } });
    const {
      name,
      images,
      price,
      description,
      CategoryId,
      importPrice,
      quantity,
    } = req.body;
    console.log(req.body);
    const filedata = req.file;
    if (!name || (!images && !filedata) || !price || !Category) {
      if (filedata) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }

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
      CategoryId,
      importPrice,
      quantity,
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
exports.deleteCategory = async (req, res, next) => {
  console.log("a");
  try {
    const categoryId = req.body.id;
    await Category.destroy({ where: { id: categoryId } });
    res.redirect("/products/add");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

exports.deleteColor = async (req, res) => {
  try {
    const productId = req.params.id;
    const colorId = req.body.id;
    await Color.destroy({
      where: {
        id: colorId,
      },
    });
    return res.redirect("/products/add/colorProduct/" + productId);
  } catch (error) {
    console.log(error);
  }
};
exports.deleteConfig = async (req, res) => {
  try {
    const productColorId = req.params.id;
    const configId = req.body.id;
    await Config.destroy({
      where: {
        id: configId,
      },
    });
    return res.redirect("/products/add/colorProduct_config/" + productColorId);
  } catch (error) {
    console.log(error);
  }
};

exports.indexColorProduct = async (req, res, next) => {
  const productId = req.params.id;
  console.log(productId);
  try {
    const listColor = await Color.findAll();
    const productColor = await productcolor.findAll({
      where: {
        productId: productId,
      },
      include: [
        {
          model: Color,
        },
      ],
    });
    if (req.session.loggedin && req.session.user) {
      // Lấy thông tin người dùng từ đối tượng session
      const loggedInUser = req.session.user;

      res.render("colorsProduct", {
        user: loggedInUser,
        color: listColor,
        productId: productId,
        data: productColor,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.addColor = async (req, res, next) => {
  const { newColor } = req.body;
  const productId = req.params.id;
  try {
    const addColor = await Color.create({ nameColor: newColor });

    return res.redirect("/products/add/colorProduct/" + productId);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.addProductColor = async (req, res, next) => {
  try {
    const { colorId, images } = req.body;
    console.log(req.body);
    const productId = req.params.id;
    const filedata = req.file;
    console.log("ok" + filedata);
    if ((!images && !filedata) || !colorId) {
      if (filedata) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }

    if (!images && !filedata) {
      if (fileData) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    let imageUrl = "";
    if (filedata) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(filedata.path);
      imageUrl = result.secure_url;
    } else if (images) {
      imageUrl = images;
    }

    const productColor = { productId, colorId, image: imageUrl };
    const createProductColor = productcolor.create(productColor);
    if (!createProductColor) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.redirect("/products/add/colorProduct/" + productId);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.deleteProductColor = async (req, res) => {
  try {
    const productColorId = req.params.productColorId;
    const productId = req.params.id;
    const del = await productcolor.destroy({
      where: {
        id: productColorId,
      },
    });
    res.redirect("/products/add/colorProduct/" + productId);
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error,
    });
  }
};

exports.addConfig = async (req, res) => {
  const { newConfig } = req.body;
  const ProductColorId = req.params.id;
  try {
    const addConfig = await Config.create({ nameConfig: newConfig });

    return res.redirect("/products/add/colorProduct_config/" + ProductColorId);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.indexConfigProductColor = async (req, res) => {
  const productColorId = req.params.id;
  console.log(productColorId);
  try {
    const listConfig = await Config.findAll();
    const productColorConfig = await ProductColorConfig.findAll({
      where: {
        ProductColorId: productColorId,
      },
      include: [
        {
          model: Config,
        },
      ],
    });
    const product = await productcolor.findOne({
      where: {
        id: productColorId,
      },
      include: {
        model: Product,
      },
    });
    if (req.session.loggedin && req.session.user) {
      // Lấy thông tin người dùng từ đối tượng session
      const loggedInUser = req.session.user;

      res.render("configProduct", {
        user: loggedInUser,
        config: listConfig,
        productColorId: productColorId,
        data: productColorConfig,
        productId: product.Product.id,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.addConfigProductColor = async (req, res) => {
  const { quantity, configId, price } = req.body;
  const productColorId = req.params.id;
  console.log(productColorId);
  try {
    if (!quantity || !price || !configId || !productColorId) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    const createConfig = {
      quantity,
      configId,
      ProductColorId: productColorId,
      price,
    };
    const createProductColorConfig = await ProductColorConfig.create(
      createConfig
    );
    if (!createProductColorConfig) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to the database" });
    }
    return res.redirect("/products/add/colorProduct_config/" + productColorId);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.deleteProductColor_config = async (req, res) => {
  try {
    const productColorId = req.params.id;
    const productColor_configId = req.params.productColor_configId;
    const del = await ProductColorConfig.destroy({
      where: {
        id: productColor_configId,
      },
    });
    res.redirect("/products/add/colorProduct_config/" + productColorId);
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error,
    });
  }
};
exports.indexProductCategory = async (req, res) => {
  const categoryID = req.params.id;
  try {
    let _name = req.query.name;
    console.log(_name);

    if (!_name) {
      _name = "";
    }

    let _page = req.query.page ? req.query.page : 1;
    let listProduct = [];
    let _limit = Number(req.query.limit ? req.query.limit : 10);
    let totalRow = 0;
    let totalPage = 0;
    if (_name) {
      totalRow = await Product.count({
        where: {
          name: { [Op.like]: `%${_name}%` },
          CategoryId: categoryID,
        },
      });
      totalPage =
        Math.ceil(totalRow / _limit) > 0 ? Math.ceil(totalRow / _limit) : 1;
      _page = _page > 0 ? Math.floor(_page) : 1;
      _page = _page <= totalPage ? Math.floor(_page) : totalPage;
      let _start = (_page - 1) * _limit;
      listProduct = await Product.findAll({
        include: [
          {
            model: Category,
          },
        ],
        where: {
          name: { [Op.like]: `%${_name}%` },
          CategoryId: categoryID,
        },
        offset: _start,
        limit: _limit,
      });
    } else {
      totalRow = await Product.count({
        where: {
          CategoryId: categoryID,
        },
      });
      totalPage =
        Math.ceil(totalRow / _limit) > 0 ? Math.ceil(totalRow / _limit) : 1;
      _page = _page > 0 ? Math.floor(_page) : 1;
      _page = _page <= totalPage ? Math.floor(_page) : totalPage;
      let _start = (_page - 1) * _limit;
      listProduct = await Product.findAll({
        where: {
          CategoryId: categoryID,
        },
        include: [
          {
            model: Category,
          },
        ],
        offset: _start,
        limit: _limit,
      });
    }
    const category = await Category.findAll();
    if (req.session.loggedin && req.session.user) {
      // Lấy thông tin người dùng từ đối tượng session
      const loggedInUser = req.session.user;

      return res.render("product", {
        cate: Number(categoryID),
        category: category,
        data: listProduct,
        search: _name,
        totalPage: totalPage,
        name: _name,
        page: _page,
        limit: _limit,
        user: loggedInUser,

        //return res.status(200).json({ status: 200, data: listProduct });
      });
    }
  } catch (error) {
    console.log(error);
    return res.render("product", {
      data: [],
      message: "Internal server error",
    });
  }
};

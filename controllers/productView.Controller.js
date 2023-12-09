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
    let totalRow = await Product.count();
    let totalPage = Math.ceil(totalRow / _limit);
    _page = _page > 0 ? Math.floor(_page) : 1;
    _page = _page <= totalPage ? Math.floor(_page) : totalPage;
    let _start = (_page - 1) * _limit;

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
      limit: _limit,

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
  const filedata = req.file;
  try {
    const { name, images, price, description, CategoryId } = req.body;
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
    return res
      .status(400)
      .json({ status: 400, message: "false connexting db" });
  }

  res.render("updateProduct", {
    category: listCategory,
    product: product,
    title: "Sửa sản phẩm",
  });
  //res.status(200).json(product);
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ where: { id: id } });
    const { name, images, price, description, CategoryId } = req.body;
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

exports.color = async (req, res) => {
  try {
    const productColor = await productcolor.findAll({
      include: [
        {
          model: Color,
        },
      ],
    });
    res.json(productColor);
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

    res.render("colorsProduct", {
      color: listColor,
      productId: productId,
      data: productColor,
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

    res.render("configProduct", {
      config: listConfig,
      productColorId: productColorId,
      data: productColorConfig,
      productId: product.Product.id,
    });
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

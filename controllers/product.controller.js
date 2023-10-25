const cloudinary = require("cloudinary").v2;
const { Product } = require("../models");
exports.getProduct = async (req, res) => {
  const listProduct = Product.findAll();
  if (listProduct) {
    return res.status(200).json({ status: 200, data: listProduct });
  } else {
    res.status(400).json({ status: 400, message: "false connexting db" });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const {
      name,
      image,
      price,
      description,
      quantity,
      categoryID,
      promotionID,
    } = req.body;
    console.log(req.body);
    const filedata = req.file;

    if (
      !name ||
      (!image && !filedata) ||
      !price ||
      !description ||
      !quantity ||
      !categoryID ||
      !promotionID
    ) {
      if (filedata) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    // Check if categoryID and promotionID are defined
    if (categoryID === undefined || promotionID === undefined) {
      return res
        .status(400)
        .json({
          status: 400,
          message: "categoryID and promotionID are required fields",
        });
    }

    let imageUrl = "";
    if (filedata) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(filedata.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    const product = {
      name,
      image: imageUrl,
      price,
      description,
      quantity,
      categoryID,
      promotionID,
    };

    const addProduct = Product.create(product);
    if (addProduct) {
      return res.status(201).json({ status: 201, data: addProduct });
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

exports.deleteProduct = async (req, res) => {
  const productID = req.params.id;
  const product = Product.findByPk(productID);
  if (!product) {
    res.status(404).json({ status: 404, message: "Product not found" });
  }
  const deleteCategory = await Product.destroy();
  if (deleteCategory) {
    res.status(200).json({ status: 200, message: "delete successfuly" });
  } else {
    res.status(400).json({ status: 400, message: "false connexting db" });
  }
};

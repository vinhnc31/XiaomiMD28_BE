const cloudinary = require("cloudinary").v2;
const { Product } = require("../models");
exports.getProduct = async (req, res) => {
  try {
    const listProduct = await Product.findAll();
    if (listProduct) {
      return res.status(200).json({ status: 200, data: listProduct });
    } else {
      res.status(400).json({ status: 400, message: "false connexting db" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.getProductID = async (req, res) => {
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
    const { name, image, price, description, quantity, CategoryId } = req.body;
    console.log(req.body);
    const filedata = req.file;

    if (
      !name ||
      (!image && !filedata) ||
      !price ||
      !quantity ||
      !CategoryId
    ) {
      if (filedata) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(filedata.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    // Check if CategoryId and PromotionId are defined
    if (!CategoryId) {
      return res.status(400).json({
        status: 400,
        message: "CategoryId are required fields",
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
      CategoryId,
    };

    const addProduct = await Product.create(product);
    console.log(addProduct);
    if (!addProduct) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(201).json({ status: 201, data: addProduct });
  } catch (error) {
    console.log(error);
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
      return res.status(404).json({ status: 404, message: "Product not found" });
    }
    
    const deleteProduct = await product.destroy();

    if (deleteProduct) {
      res.status(204).json({ status: 204, message: "delete successfuly" });
    } else {
      res.status(400).json({ status: 400, message: "false connexting db" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

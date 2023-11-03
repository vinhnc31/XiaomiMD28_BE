const cloudinary = require("cloudinary").v2;
const { Product_Color } = require("../models");
exports.createProductColor = async (req, res) => {
  const { productId, colorId, image } = req.body;
  const fileData = req.file;
  try {
    if (!productId || !colorId) {
      return res.status(404).json({
        status: 404,
        message: "Product or Color not found",
      });
    }
    if (!image && !fileData) {
      if (fileData) {
        // Nếu có lỗi và có tệp ảnh đã tải lên, hủy tệp ảnh trên Cloudinary
        cloudinary.uploader.destroy(fileData.filename);
      }
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    let imageUrl = "";
    if (fileData) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(fileData.path);
      imageUrl = result.secure_url;
    } else if (image) {
      imageUrl = image;
    }

    const productColor = { productId, colorId, image: imageUrl };
    const createProductColor = Product_Color.create(productColor);
    if (!createProductColor) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(201).json({ status: 201, data: productColor });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteProductColor = async (req, res) => {
  const id = req.params.id;
  try {
    const whereId = Product_Color.findByPk(id);

    if (!whereId) {
      return res
        .status(404)
        .json({ status: 404, message: "Product_Color not found" });
    }
    const deleteProductColor = await whereId.destroy();
    if (!deleteProductColor) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res
      .status(204)
      .json({ status: 204, message: "Delete Product_Color successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

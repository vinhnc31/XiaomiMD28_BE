const { Comment, Account, Orders } = require("../models");
const cloudinary = require("cloudinary").v2;
exports.getProductId = async (req, res) => {
  const ProductId = +req.params.ProductId;
  try {
    if (!ProductId) {
      return res.status(400).json({
        status: 400,
        message: "ProductId are required fields",
      });
    }
    const listcomment = await Comment.findAll({
      include: [{ model: Account }],
      where: { ProductId: ProductId },
    });
    if (!listcomment) {
      return res
        .status(404)
        .json({ status: 404, message: "Comment not found" });
    }
    return res.status(200).json({ status: 200, data: listcomment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createComment = async (req, res) => {
  const { productId, AccountId, commentBody, images, star } = req.body;
  const fileData = req.file;
  try {
    const checkUser = await Account.findByPk(AccountId);
    if (!checkUser) {
      return res
        .status(404)
        .json({ status: 404, message: "Account not found" });
    }
    if (!commentBody) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    if (!productId || !AccountId) {
      return res.status(400).json({
        status: 400,
        message: "ProductId are required fields",
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
    const comment = {
      productId,
      AccountId,
      commentBody,
      images: imageUrl,
      star,
    };
    console.log(comment.images);
    const addComment = await Comment.create(comment);

    if (!addComment) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(201).json({ status: 201, data: addComment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateComment = async (req, res) => {
  const id = req.params.id;
  const { ProductId, AccountId, commentBody, images, star } = req.body;
  const fileData = req.file;
  try {
    if (!ProductId) {
      return res.status(400).json({
        status: 400,
        message: "ProductId are required fields",
      });
    }
    const comments = await Comment.findByPk(id);
    if (!comments) {
      return res
        .status(404)
        .json({ status: 404, message: "Comment not found" });
    }
    let imageUrl = comments.images;
    if (fileData) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(fileData.path);
      imageUrl = result.secure_url;
    } else if (images) {
      imageUrl = images;
    }
    const comment = {
      ProductId,
      AccountId,
      commentBody,
      images: imageUrl,
      star,
    };
    const updateComment = await Comment.update(comment, { where: { id: id } });
    if (!updateComment) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, data: updateComment });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteComment = await Comment.findByPk(id);
    if (!deleteComment) {
      return res.status(404).json({
        status: 404,
        message: "Id not fount",
      });
    }
    const comment = deleteComment.destroy();
    if (!comment) {
      return res
        .status(500)
        .json({ status: 500, message: "Error connecting to database" });
    }
    return res.status(200).json({ status: 200, message: "Delete successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

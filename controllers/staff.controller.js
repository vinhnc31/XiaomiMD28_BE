const { Staff } = require("../models");

const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
exports.getStaff = async (req, res) => {
  try {
    const listStaff = await Staff.findAll();

    if (!listStaff) {
      return res.status(404).json({ status: 404, message: "No staff found" });
    }

    return res.status(200).json({ status: 200, data: listStaff });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.createStaff = async (req, res) => {
  const {
    name,
    avatar,
    address,
    gender,
    dateOfBirth,
    email,
    phone,
    position,
    degree,
    password,
  } = req.body;
  const fileData = req.file;
  try {
    if (
      !name ||
      !dateOfBirth ||
      (!avatar && !fileData) ||
      !position ||
      !address ||
      !gender ||
      !email ||
      !phone ||
      !degree ||
      !password
    ) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    let imageUrl = "";
    if (fileData) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(fileData.path);
      imageUrl = result.secure_url;
    } else if (avatar) {
      imageUrl = avatar;
    }

    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = {
      name,
      avatar: imageUrl,
      address,
      gender,
      dateOfBirth,
      email,
      phone,
      position,
      degree,
      password: hashedPassword,
    };
    const checkEmail = await Staff.findOne({ where: { email: email } });
    if (checkEmail) {
      return res
        .status(400)
        .json({ status: 400, message: "email already exist" });
    }
    const createStaff = await Staff.create(staff);
    if (!createStaff) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(201).json({ status: 201, data: createStaff });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateStaff = async (req, res) => {
  const {
    name,
    avatar,
    address,
    gender,
    dateOfBirth,
    phone,
    position,
    degree,
  } = req.body;
  const fileData = req.file;
  const id = req.params.id;
  try {
    const checkId = await Staff.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "staff not found" });
    }
    let imageUrl = checkId.avatar;
    if (fileData) {
      // Tiến hành tải lên hình ảnh lên Cloudinary
      const result = await cloudinary.uploader.upload(fileData.path);
      imageUrl = result.secure_url;
    } else if (avatar) {
      imageUrl = avatar;
    }
    const staff = {
      name,
      avatar: imageUrl,
      address,
      gender,
      dateOfBirth,
      phone,
      position,
      degree,
    };
    const updateStaff = await Staff.update(staff, { where: { id: id } });
    if (!updateStaff) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "Update successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.deleteStaff = async (req, res) => {
  const id = req.params.id;
  try {
    const checkId = await Staff.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Staff not found" });
    }
    const deleteStaff = await checkId.destroy();
    if (!deleteStaff) {
      return res
        .status(400)
        .json({ status: 400, message: "Error connecting to database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "delete successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.loginWeb = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    console.log(req.body.email);
    const result = await Staff.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!result) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }
    console.log("chạy");
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      result.password
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid email or password" });
    }
    return res.status(200).json({ status: 200, data: result });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

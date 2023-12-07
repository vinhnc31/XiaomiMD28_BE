const { Staff, sequelize } = require("../models");

const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const cloudinary = require("cloudinary").v2;
exports.getStaff = async (req, res) => {
  try {
    const listStaff = await Staff.findAll();

    if (!listStaff) {
      return res.status(404).json({ status: 404, message: "No staff found" });
    }
    res.render('staffManager', {"staffs": listStaff });

    // return res.status(200).json({ status: 200, data: listStaff });
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
  console.log(req.body)
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
    const listStaff = await Staff.findAll();
    // return res.render('/', {"staffs": listStaff });
    return res.render('staffManager', {"staffs": listStaff });
    // return res.status(201).json({ status: 201, data: createStaff });
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
    // return res
    //   .status(200)
    //   .json({ status: 200, message: "Update successfully" });
    return res.redirect("/staff");
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
    const listStaff = await Staff.findAll();
    // res.render('/staffManager', {"staffs": listStaff });
    return res.redirect("/staff");
    // return res
    //   .status(200)
    //   .json({ status: 200, message: "delete successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.viewUpdateStaff = async (req, res, next) => {
  const id = req.params.id;
  const staff = await Staff.findOne({
    where: {
      id: id,
    },
  });
  // const listCategory = await Category.findAll();
  // if (listCategory) {
  // } else {
  //   res.status(400).json({ status: 400, message: "false connexting db" });
  // }
 console.log(staff)
  res.render("updateStaff", {
    // category: listCategory,
    staff: staff,
    title: "Sửa nhân viên",
  });
};

exports.searchStaff = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra xem 'name' có tồn tại hay không
    if (!name) {
      return res.status(400).json({ status: 400, message: "'name' parameter is required" });
    }

    const listStaff = await Staff.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });

    if (!listStaff || listStaff.length === 0) {
      return res.redirect("/staff");
    }

    res.render('staffManager', { staffs: listStaff });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
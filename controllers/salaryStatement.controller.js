const { Salaries, Staff } = require("../models");
exports.getSalary = async (req, res) => {
  try {
    const listSalary = await Salaries.findAll({
      include: [{ model: Staff, as: "staff" }],
    });
    if (!listSalary) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    res.render('salaryStatement', {"salaryList": listSalary });
    console.log(listSalary)
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.createSalaryStatement = async (req, res) => {
  const { StaffId, salary, salaryDeduction, status } = req.body;
  try {
    console.log(req.body);
    const checkStaff = await Staff.findByPk(StaffId);
    if (!checkStaff) {
      return res.status(404).json({ status: 404, message: "Staff not found" });
    }
    if (!salary || !salaryDeduction || !status) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    const totalSalary = salary - salaryDeduction;
    console.log(totalSalary);
    const salaries = {
      StaffId,
      salary,
      salaryDeduction,
      totalPrice: totalSalary,
      status,
    };

    const createSalary = await Salaries.create(salaries);
    if (!createSalary) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(201).json({ status: 201, data: createSalary });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateSalary = async (req, res) => {
  const id = req.params.id;
  const { StaffId, salary, salaryDeduction, status } = req.body;
  try {
    const checkId = await Salaries.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Salary not found" });
    }
    const salaries = { StaffId, salary, salaryDeduction, status };

    const updateSalary = await Salaries.update(salaries, { where: { id: id } });

    if (!updateSalary) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }

    return res
      .status(200)
      .json({ status: 200, message: "update successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.deleteSalary = async (req, res) => {
  const id = req.params.id;
  try {
    const checkId = await Salaries.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Salary not found" });
    }
    const deleteSalary = await checkId.destroy();
    if (!deleteSalary) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
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

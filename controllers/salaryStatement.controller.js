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
    
    if (req.session.loggedin && req.session.user) {
      // Lấy thông tin người dùng từ đối tượng session
      const loggedInUser = req.session.user;
      res.render('salaryStatement', {salaryList: listSalary, user: loggedInUser });
    }

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
    return res.redirect("/salary");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};

exports.updateSalary = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const checkId = await Salaries.findByPk(id);
    if (!checkId) {
      return res.status(404).json({ status: 404, message: "Salary not found" });
    }
    const salaries = { status };

    const updateSalary = await Salaries.update(salaries, { where: { id: id } });

    if (!updateSalary) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }

    return res.redirect("/salary");
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
    console.log(id)
    const salary = await Salaries.findAll();
    console.log(salary)
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
    return res.redirect("/salary");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
};
exports.viewAdd = async (req, res) => {
  const listStaff = await Staff.findAll();
  
    if (!listStaff) {
      return res.status(404).json({ status: 404, message: "No staff found" });
    }
  return res.render('AddSalary', {"staffs": listStaff });
};

exports.viewUpdateSalary = async (req, res, next) => {
  const id = req.params.id;
  const salaries = await Salaries.findOne({
    where: {
      id: id,
    },
  });
 console.log(salaries)
 const staff = await Staff.findOne({
  where: {
    id: salaries.StaffId,
  },
});
if (req.session.loggedin && req.session.user) {
  // Lấy thông tin người dùng từ đối tượng session
  const loggedInUser = req.session.user;
  res.render("updateSalary", {
    staff: staff,
    Salaries: salaries,
    title: "Sửa lương",
    user: loggedInUser
  });
}
  
}; 
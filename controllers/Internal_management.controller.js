const { Internals, Staff } = require("../models");
exports.getInternal = async (req, res) => {
  try {
    const listInternal = await Internals.findAll({
      include: [{ model: Staff, as: "staffInternals" }],
    });
    if (!listInternal) {
      return res.status(400).json({
        status: 400,
        message: "Failed to retrieve data from the database",
      });
    }
    return res.status(200).json({ status: 200, data: listInternal });
  } catch (error) {
    console.error("Error in getInternal:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.createInternal = async (req, res) => {
  const { StaffId, reason, status } = req.body;
  try {
    const checkStaff = await Staff.findByPk(StaffId);
    if (!checkStaff) {
      return res.status(404).json({ status: 404, message: "Staff not found" });
    }
    if (!reason || !status) {
      return res
        .status(400)
        .json({ status: 400, message: "Fields cannot be left blank" });
    }
    const internal = { StaffId, reason, status };
    console.log(internal);
    const createInternal = await Internals.create(internal);
    console.log("chạy");
    if (!createInternal) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res.status(200).json({ status: 200, data: createInternal });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

exports.deleteInternal = async (req, res) => {
  const id = req.params.id;
  try {
    const checkId = await Internals.findByPk(id);
    if (!checkId) {
      return res
        .status(404)
        .json({ status: 404, message: "Internal not found" });
    }
    const deleteInternal = await checkId.destroy();

    if (!deleteInternal) {
      return res
        .status(400)
        .json({ status: 400, message: "connect fail database" });
    }
    return res
      .status(200)
      .json({ status: 200, message: "delete successfully" });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

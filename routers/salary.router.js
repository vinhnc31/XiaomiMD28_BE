const express = require("express");
const routers = express.Router();

const salaryController = require("../controllers/salaryStatement.controller");

routers.get("/salary", salaryController.getSalary);
routers.post("/salary", salaryController.createSalaryStatement);
routers.put("/salary/:id", salaryController.updateSalary);
routers.delete("/salary/:id", salaryController.deleteSalary);
module.exports = routers;

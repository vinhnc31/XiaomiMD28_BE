const express = require("express");
const routers = express.Router();

const salaryController = require("../controllers/salaryStatement.controller");

routers.get("/salary", salaryController.getSalary);
routers.post("/salary", salaryController.createSalaryStatement);
routers.post("/salaryUpdate/:id", salaryController.updateSalary);
routers.post("/salary/:id", salaryController.deleteSalary);
routers.get("/addSalary", salaryController.viewAdd);
routers.get("/updateSalary/:id", salaryController.viewUpdateSalary);
module.exports = routers;
 
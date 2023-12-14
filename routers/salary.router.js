const express = require("express");
const routers = express.Router();

const salaryController = require("../controllers/salaryStatement.controller");
const middleWare = require("../middleWare/auth.middlewere");

routers.get("/salary", middleWare.loggedin, salaryController.getSalary);
routers.post("/salary", salaryController.createSalaryStatement);
routers.post("/salaryUpdate/:id", salaryController.updateSalary);
routers.post("/salary/:id", salaryController.deleteSalary);
routers.get("/addSalary", middleWare.loggedin,salaryController.viewAdd);
routers.get("/updateSalary/:id", middleWare.loggedin,salaryController.viewUpdateSalary);
module.exports = routers;
 
const express = require("express");
const routers = express.Router();

const salaryController = require("../controllers/salaryStatement.controller");
const middleWare = require("../middleWare/auth.middlewere");

routers.get("/salary", middleWare.loggedin, salaryController.getSalary);
routers.post("/salary", middleWare.loggedin,salaryController.createSalaryStatement);
routers.post("/salaryUpdate/:id", middleWare.loggedin,salaryController.updateSalary);
routers.post("/salary/:id", middleWare.loggedin,salaryController.deleteSalary);
routers.get("/addSalary", middleWare.loggedin,salaryController.viewAdd);
routers.get("/updateSalary/:id", middleWare.loggedin,salaryController.viewUpdateSalary);
routers.post("/searchSalary", middleWare.loggedin,salaryController.searchSalary);

module.exports = routers;
 
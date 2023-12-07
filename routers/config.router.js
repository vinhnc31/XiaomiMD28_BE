const express = require("express");
const routers = express.Router();
const configController = require("../controllers/config.controller");

routers.get("/config", configController.getConfig);
routers.post("/config", configController.createConfig);
routers.delete("/config/:id", configController.deleteConfig);

module.exports = routers;

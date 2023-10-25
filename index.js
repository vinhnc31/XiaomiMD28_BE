const express = require("express");
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");
const category = require("./routers/category.router");
const product = require("./routers/product.router");
const promotion = require("./routers/promotion.router");
const categoryView = require("./routers/categoryView.router");
const db = require("./models");
const PORT = process.env.POST || 5000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/category", category);
app.use("/api/product", product);
app.use("/api/promotion", promotion);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("server start loacalhost: " + PORT);
  });
});

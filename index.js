const express = require("express");
const app = express();
require("dotenv").config();
require("./untils/passport");

const bodyParser = require("body-parser");
const swaggerjsdoc = require("swagger-jsdoc");
const admin = require("firebase-admin");
const swaggerUi = require("swagger-ui-express");
const category = require("./routers/category.router");
const product = require("./routers/product.router");
const promotion = require("./routers/promotion.router");
const comment = require("./routers/comment.router");
const account = require("./routers/accounts.router");
const address = require("./routers/address.router");
const favorites = require("./routers/favorites.router");
const color = require("./routers/color.router");
const product_color = require("./routers/product_color.router");
const cart = require("./routers/cart.router");
const config = require("./routers/config.router");
const order = require("./routers/order.router");
const vnPay = require("./routers/vnpay.router");
const salary = require("./routers/salary.router");
const internal = require("./routers/Internal.router");
const db = require("./models");
const product_color_config = require("./routers/productcolor_config.router");
const staff = require("./routers/staff.router");
const productView = require("./routers/productView.router");

const PORT = process.env.POST || 3000;
const path = require('path');

app.set("view engine", "ejs");
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.static("views"));
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API XIAOMI_MD28_BE",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./routers/*.js"],
};
const spacs = swaggerjsdoc(options);
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spacs));
app.use("/api", category);
app.use("/api", product);
app.use("/api", promotion);
app.use("/api", comment);
app.use("/", account);
app.use("/api", account);
app.use("/api", address);
app.use("/api", favorites);
app.use("/api", color);
app.use("/api", product_color);
app.use("/api", cart);
app.use("/api", config);
app.use("/api", product_color_config);
app.use("/api", order);
app.use("/api", vnPay);
app.use("/", staff);
app.use("/", salary);
app.use("/api", internal);
app.get("/", function (req, res) {
  res.render("login");
});
app.get("/homeTest", function (req, res) {
  res.render("home");
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/updateStaffTest", function(req, res){
  res.render('updateStaff');
});
app.get("/passTest", function(req, res){
  res.render('reset-password');
});
app.get("/salesTest", function(req, res){
  res.render('salesReport');
});

app.get("/form-addStaff", function(req, res){
  res.render('addStaff');
});
app.get("/InternalManagement", function(req, res){
  res.render('InternalManagement');
});



app.use("/products", productView);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("server start loacalhost: " + PORT);
  });
});

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "123456789",
  database: "test",
  insecureAuth: true,
});

// connection.connect((error) => {
//   if (error) throw error;
//   console.log("Kết nối thành công");
// });
connection.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối: " + err.stack);
    return;
  }

  console.log("Kết nối thành công!");
});
module.exports = connection;

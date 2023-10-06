const db = require("../database/mysql");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const bcrypt = require("bcrypt");
const User = function (user) {
  this.idUser = user.idUser;
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
  this.verified = user.verified;
};
User.create = (newUser, result) => {
  newUser.verified = false;
  db.query("INSERT INTO user SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created user: ", { idUser: res.idUser, ...newUser });
    result(null, res.idUser);
  });
};
// User.findByEmail = (email, result) => {
//   db.query(`SELECT * FROM user WHERE email = '${email}'`, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return err;
//     }
//     if (res.length) {
//       console.log("found email: ", res[0]);
//       result(null, res[0]);
//       return res[0];
//     }
//     // not found user with the email
//     result({ kind: "not_found" }, null);
//   });
// };
User.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM user WHERE email = '${email}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else if (res.length) {
        console.log("found email: ", res[0]);
        resolve(res[0]);
      } else {
        reject({ kind: "not_found" });
      }
    });
  });
};
User.findById = (id, result) => {
  db.query(`SELECT * FROM user WHERE idUser = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    if (res.length) {
      console.log("found id: ", res[0]);
      result(null, res[0]);
      return;
    }
    // not found user with the email
    result({ kind: "not_found" }, null);
  });
};
User.updateByEmail = (email, user, result) => {
  db.query(
    "UPDATE user SET idUser=?, name = ?, password = ? WHERE email = ?",
    [user.idUser, user.name, user.password, email],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, { err: err });
        return;
      }
      if (res.affectedRows == 0) {
        // not found user with the email
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated user: ", { email: email, ...user });
      result(null, { email: email, ...user });
    }
  );
};
User.updateVerify = (id, verify, result) => {
  db.query(
    "UPDATE user SET verified=? WHERE idUser = ?",
    [verify, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("updated verify: ", verify);
      result(null, { message: "Update verify suscess" });
    }
  );
};
User.deleteByEmail = (email, result) => {
  db.query("DELETE FROM user WHERE email = ?", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      // not found user with the email
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("deleted user with email: ", email);
    result(null, { message: "Xóa thành công" });
  });
};

module.exports = User;

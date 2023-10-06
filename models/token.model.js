const db = require("../database/mysql");
const Token = function (data) {
  this.token = data.token;
  this.idUser = data.idUser;
};
Token.create = (newToken, result) => {
  db.query("insert into token set ?", newToken, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created token: ", { idtoken: res.idtoken, ...newToken });
    result(null, { idtoken: res.idtoken, ...newToken });
  });
};
Token.updateByIdUser = (id, data, result) => {
  db.query(
    "update token set token=? where idUser=?",
    [data.token, id],
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
      console.log("updated token: ", { idUser: id, ...data });
      result(null, { idUser: id, ...data });
    }
  );
};
Token.deleteByID = (id, result) => {
  db.query("DELETE FROM token WHERE idUser = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }
    console.log("deleted token with idUser: ", id);
    result(null, { message: "Xóa thành công" });
  });
};
Token.findByIdAndToken = (id, token, result) => {
  db.query(
    `SELECT * FROM token WHERE idUser = '${id}'and token='${token}'`,
    (err, res) => {
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

      result({ kind: "not_found" }, null);
    }
  );
};
module.exports = Token;

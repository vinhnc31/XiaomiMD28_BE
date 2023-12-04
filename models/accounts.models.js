module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define("Account", {
    avatar: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dayOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Account.associate = (models) => {
    // Thiết lập quan hệ một-nhiều với mô hình "Comment"
    Account.hasMany(models.Comment, {
      onDelete: "CASCADE", // Cascade xóa các Comment liên quan khi một Product bị xóa
      foreignKey: "AccountId", // Tên trường khóa ngoại trong bảng "Comment"
      as: "comments", // Tên thay thế cho quan hệ
    });

    // Thiết lập quan hệ một-nhiều với mô hình "Favorites"
    Account.hasMany(models.Favorites, {
      onDelete: "CASCADE", // Cascade xóa các Favorites liên quan khi một Product bị xóa
      foreignKey: "AccountId", // Tên trường khóa ngoại trong bảng "Favorites"
      as: "favorites", // Tên thay thế cho quan hệ
    });
    // Thiết lập quan hệ một-nhiều với mô hình "Address"
    Account.hasMany(models.Address, {
      onDelete: "CASCADE", // Cascade xóa các Favorites liên quan khi một Product bị xóa
      foreignKey: "AccountId", // Tên trường khóa ngoại trong bảng "Favorites"
      as: "address", // Tên thay thế cho quan hệ
    });

    Account.hasMany(models.Cart, {
      onDelete: "CASCADE", // Cascade xóa các Favorites liên quan khi một Product bị xóa
      foreignKey: "AccountId", // Tên trường khóa ngoại trong bảng "Favorites"
      as: "carts", // Tên thay thế cho quan hệ
    });
  };

  return Account;
};

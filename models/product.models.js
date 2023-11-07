module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Product.associate = (models) => {
    // Thiết lập quan hệ một-nhiều với mô hình "Comment"
    Product.hasMany(models.Comment, {
      onDelete: "CASCADE", // Cascade xóa các Comment liên quan khi một Product bị xóa
      foreignKey: "productId", // Tên trường khóa ngoại trong bảng "Comment"
      as: "comments", // Tên thay thế cho quan hệ
    });

    // Thiết lập quan hệ một-nhiều với mô hình "Favorites"
    Product.hasMany(models.Favorites, {
      onDelete: "CASCADE", // Cascade xóa các Favorites liên quan khi một Product bị xóa
      foreignKey: "productId", // Tên trường khóa ngoại trong bảng "Favorites"
      as: "favorites", // Tên thay thế cho quan hệ
    });
    Product.belongsTo(models.Category, { foreignKey: "CategoryId" });
  };
  return Product;
};

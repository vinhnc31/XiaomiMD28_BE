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
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
    images: {
      type: DataTypes.TEXT, // Chỉnh sửa kiểu dữ liệu thành TEXT nếu cần
      allowNull: false,
    },
  });

  Product.associate = (models) => {
    // Thiết lập quan hệ một-nhiều với mô hình "Comment"
    Product.hasMany(models.Comment, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "comments",
    });

    // Thiết lập quan hệ một-nhiều với mô hình "Favorites"
    Product.hasMany(models.Favorites, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "favorites",
    });

    // Thiết lập quan hệ một-nhiều với mô hình "Product_Color"
    Product.hasMany(models.productcolor, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "colorProducts",
    });
    Product.belongsTo(models.Category, {
      foreignKey: "CategoryId",
    });
  };

  return Product;
};

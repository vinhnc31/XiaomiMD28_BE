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
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    Product.hasMany(models.Product_Color, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "colorProducts",
    });
  };

  return Product;
};

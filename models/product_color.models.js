module.exports = (sequelize, DataTypes) => {
  const ProductColor = sequelize.define("productcolor", {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  ProductColor.associate = (models) => {
    ProductColor.belongsTo(models.Product, { foreignKey: "productId" });
    ProductColor.belongsTo(models.Color, { foreignKey: "colorId" });
    ProductColor.hasMany(models.Cart, {
      foreignKey: "ProductColorId",
      as: "colorProducts",
    });

    ProductColor.hasMany(models.ProductColorConfig, {
      foreignKey: "ProductColorId",
      as: "colorConfigs", // Changed alias for clarity
    });
    ProductColor.hasMany(models.OrdersProduct, {
      onDelete: "CASCADE",
      foreignKey: "ProductColorId",
      as: "ordersProduct", // Changed alias for clarity
    });
  };

  return ProductColor;
};

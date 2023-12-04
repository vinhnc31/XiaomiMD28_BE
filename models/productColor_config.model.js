module.exports = (sequelize, DataTypes) => {
  const ProductColorConfig = sequelize.define("ProductColorConfig", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  ProductColorConfig.associate = (models) => {
    ProductColorConfig.belongsTo(models.productcolor, {
      foreignKey: "ProductColorId",
    });
    ProductColorConfig.belongsTo(models.Config, {
      foreignKey: "configId",
    });
    ProductColorConfig.hasMany(models.Cart, {
      foreignKey: "ProductColorConfigId",
      as: "colorConfigs", // Changed alias for clarity
    });
    ProductColorConfig.hasMany(models.OrdersProduct, {
      onDelete: "CASCADE",
      foreignKey: "ProductColorConfigId",
      as: "ordersProduct", // Changed alias for clarity
    });
  };

  return ProductColorConfig;
};

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
    console.log("aaaaaaaa" + models.productcolor); // Check if this logs the correct model
    ProductColorConfig.belongsTo(models.productcolor, {
      foreignKey: "ProductColorId",
    });
    console.log("bbbbbbbbb" + models.Config); // Check if this logs the correct model
    ProductColorConfig.belongsTo(models.Config, {
      foreignKey: "configId",
    });
  };

  return ProductColorConfig;
};

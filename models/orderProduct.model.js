module.exports = (sequelize, DataTypes) => {
  const OrdersProduct = sequelize.define("OrdersProduct", {});
  OrdersProduct.associate = (models) => {
    OrdersProduct.belongsTo(models.Product, { foreignKey: "productId" });
    OrdersProduct.belongsTo(models.productcolor, {
      foreignKey: "ProductColorId",
    });
    OrdersProduct.belongsTo(models.ProductColorConfig, {
      foreignKey: "ProductColorConfigId",
    });
  };
  return OrdersProduct;
};

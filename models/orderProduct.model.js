module.exports = (sequelize, DataTypes) => {
  const OrdersProduct = sequelize.define(
    "OrdersProduct",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true }
  );
  OrdersProduct.associate = (models) => {
    OrdersProduct.belongsTo(models.Product, { foreignKey: "productId" });
    OrdersProduct.belongsTo(models.productcolor, {
      foreignKey: "ProductColorId",
    });
    OrdersProduct.belongsTo(models.ProductColorConfig, {
      foreignKey: "ProductColorConfigId",
    });
    OrdersProduct.belongsTo(models.Orders, {
      foreignKey: "OrderId",
    });
  };
  return OrdersProduct;
};

module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define("Orders", {
    message: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
  });

  Orders.associate = (models) => {
    Orders.belongsTo(models.Account, { foreignKey: "AccountId" });
    Orders.belongsTo(models.Address, { foreignKey: "AddressId" });
    Orders.belongsTo(models.Pay, { foreignKey: "PayId" });
    Orders.belongsTo(models.Promotion, { foreignKey: "PromotionId" });
    Orders.hasMany(models.OrdersProduct, { foreignKey: "OrderId" });
  };
  return Orders;
};

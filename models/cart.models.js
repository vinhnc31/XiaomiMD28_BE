module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    total_price: { type: DataTypes.FLOAT, allowNull: false },
  });
  Cart.associate = (models) => {
    Cart.belongsTo(models.Product, { foreignKey: "productId" });
    Cart.belongsTo(models.Account, { foreignKey: "AccountId" });
    Cart.belongsTo(models.Product_Color, { foreignKey: "ProductColorId" });
  };
  return Cart;
};

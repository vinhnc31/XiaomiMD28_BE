module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {});
  Cart.associate = (models) => {
    Cart.belongsTo(models.Product, { foreignKey: "productId" });
    Cart.belongsTo(models.Account, { foreignKey: "AccountId" });
    Cart.belongsTo(models.Product_Color, { foreignKey: "ProductColorId" });
  };
  return Cart;
};

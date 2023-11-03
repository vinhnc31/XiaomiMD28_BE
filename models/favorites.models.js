module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define("Favorites", {});
  Favorites.associate = (models) => {
    Favorites.belongsTo(models.Product, { foreignKey: "productId" });
  };
  return Favorites;
};

module.exports = (sequelize, DataTypes) => {
  const Favorites = sequelize.define(
    "Favorites",
    {
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true }
  );
  Favorites.associate = (models) => {
    Favorites.belongsTo(models.Product, { foreignKey: "productId" });
  };
  return Favorites;
};

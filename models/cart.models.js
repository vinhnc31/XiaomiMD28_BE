module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
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

  Cart.associate = (models) => {
    Cart.belongsTo(models.Product, {
      foreignKey: {
        name: "productId",
        allowNull: false,
      },
    });

    Cart.belongsTo(models.Account, {
      foreignKey: {
        name: "AccountId",
        allowNull: false,
      },
    });

    Cart.belongsTo(models.productcolor, {
      foreignKey: {
        name: "ProductColorId",
      },
    });

    Cart.belongsTo(models.ProductColorConfig, {
      foreignKey: {
        name: "ProductColorConfigId",
      },
    });
  };

  return Cart;
};

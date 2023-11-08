module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_Price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

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
    Cart.belongsTo(models.Product_Color, {
      foreignKey: {
        name: "ProductColorId",
        allowNull: false,
      },
    });
    // Cart.hasMany(models.Order, {
    //   onDelete: "CASCADE",
    //   foreignKey: {
    //     name: "CartId",
    //     allowNull: false,
    //   },
    //   as: "carts",
    // });
  };

  return Cart;
};

module.exports = (sequelize, DataTypes) =>  {
  const Product_Color = sequelize.define("Product_Color", {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Product_Color;
};

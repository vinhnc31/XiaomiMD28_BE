module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define("Color", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Color.associate = (models) => {
    Color.hasMany(models.productcolor, {
      onDelete: "CASCADE",
      foreignKey: "colorId",
      as: "colorProducts",
    });
  };
  return Color;
};

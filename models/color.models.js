module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define("Color", {
    nameColor: {
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

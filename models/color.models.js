module.exports = (sequelize, DataTypes) => {
  const Color = sequelize.define(
    "Color",
    {
      nameColor: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true }
  );
  Color.associate = (models) => {
    Color.hasMany(models.productcolor, {
      onDelete: "CASCADE",
      foreignKey: "colorId",
      as: "colorProducts",
    });
  };
  return Color;
};

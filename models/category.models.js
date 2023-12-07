module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: "CategoryId",
      onDelete: "cascade",
    });
  };

  return Category;
};

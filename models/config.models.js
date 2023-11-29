module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define("Config", {
    nameConfig: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Config.associate = (models) => {
    Config.hasMany(models.ProductColorConfig, {
      onDelete: "CASCADE",
      foreignKey: "configId", // Using camelCase for foreign key
      as: "colorProductConfig",
    });
  };

  return Config;
};

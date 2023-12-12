module.exports = (sequelize, DataTypes) => {
  const Config = sequelize.define(
    "Config",
    {
      nameConfig: {
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

  Config.associate = (models) => {
    Config.hasMany(models.ProductColorConfig, {
      onDelete: "CASCADE",
      foreignKey: "configId", // Using camelCase for foreign key
      as: "colorProductConfig",
    });
  };

  return Config;
};

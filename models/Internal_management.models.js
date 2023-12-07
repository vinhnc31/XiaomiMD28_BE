module.exports = (sequelize, DataTypes) => {
  const Internals = sequelize.define("Internals", {
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Internals.associate = (models) => {
    Internals.belongsTo(models.Staff, {
      foreignKey: "StaffId",
      as: "staffInternals",
    });
  };

  return Internals;
};

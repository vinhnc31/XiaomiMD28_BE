module.exports = (sequelize, DataTypes) => {
  const Pay = sequelize.define(
    "Pay",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true }
  );

  // Pay.associate = (models) => {
  //   Pay.hasMany(models.Order, {
  //     onDelete: "CASCADE",
  //     foreignKey: {
  //       name: "PayId",
  //       allowNull: false,
  //     },
  //     as: "pays",
  //   });
  // };

  return Pay;
};

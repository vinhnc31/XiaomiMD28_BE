module.exports = (sequelize, DataTypes) => {
  const Pay = sequelize.define("Pay", {
    name: { type: DataTypes.STRING, allowNull: false },
  });

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

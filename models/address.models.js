module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define("Address", {
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commune: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Address;
};

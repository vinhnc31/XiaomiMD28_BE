module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      nameReceiver: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneReceiver: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
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
  return Address;
};

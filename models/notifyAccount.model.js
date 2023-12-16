module.exports = (sequelize, DataTypes) => {
  const notifyAccount = sequelize.define(
    "notifyAccount",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageVoucher: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true }
  );
  notifyAccount.associate = (models) => {
    notifyAccount.belongsTo(models.Orders, {
      foreignKey: "OrderId",
    });
    notifyAccount.belongsTo(models.Promotion, {
      foreignKey: "VoucherId",
    });
  };
  return notifyAccount;
};

module.exports = (sequelize, DataTypes) => {
  const notifyAccount = sequelize.define("notifyAccount", {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return notifyAccount;
};

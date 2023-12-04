module.exports = (sequelize, DataTypes) => {
  const Notify = sequelize.define("Notify", {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Notify;
};

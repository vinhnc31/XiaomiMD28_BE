module.exports = (sequelize, DataTypes) => {
  const Account_google = sequelize.define(
    "Account_google",
    {
      idUser: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "User",
      },
    },
    { timestamp: false }
  );
  return Account_google;
};

module.exports = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    "Token",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deleteAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { paranoid: true, timestamps: true }
  );

  return Token;
};

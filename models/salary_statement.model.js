module.exports = (sequelize, DataTypes) => {
  const SalaryStatement = sequelize.define("Salary", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salary: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    salaryDeduction: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  return SalaryStatement;
};

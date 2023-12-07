module.exports = (sequelize, DataTypes) => {
  const Salaries = sequelize.define("Salaries", {
    salary: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    salaryDeduction: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  Salaries.associate = (models) => {
    Salaries.belongsTo(models.Staff, {
      foreignKey: "StaffId",
      as: "staff",
    });
  };

  return Salaries;
};

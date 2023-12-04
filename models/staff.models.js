module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define("Staff", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Staff.associate = (models) => {
    Staff.hasOne(models.Salaries, {
      onDelete: "CASCADE",
      foreignKey: "StaffId",
      as: "staff",
    });
    Staff.hasOne(models.Internals, {
      onDelete: "CASCADE",
      foreignKey: "StaffId",
      as: "staffInternals",
    });
  };

  return Staff;
};

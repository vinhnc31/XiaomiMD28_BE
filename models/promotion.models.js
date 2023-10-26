module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define("Promotion", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT, // Sử dụng TEXT thay cho STRING cho mô tả dài hơn
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0, // Đảm bảo giảm giá không âm
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Promotion;
};
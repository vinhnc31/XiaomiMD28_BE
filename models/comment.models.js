module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      commentBody: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      images: {
        type: DataTypes.TEXT, // Sửa kiểu dữ liệu thành TEXT
        allowNull: false,
        get() {
          // Parse mảng từ chuỗi JSON
          const images = this.getDataValue("images");
          return images ? JSON.parse(images) : [];
        },
        set(value) {
          // Chuyển mảng thành chuỗi JSON
          this.setDataValue("images", JSON.stringify(value));
        },
      },
      star: { type: DataTypes.INTEGER, allowNull: false },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { paranoid: true, timestamps: true }
  );
  Comment.associate = (models) => {
    Comment.belongsTo(models.Account, {
      foreignKey: {
        name: "AccountId",
        allowNull: false,
      },
    });
  };
  return Comment;
};

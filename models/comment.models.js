module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Comment;
};

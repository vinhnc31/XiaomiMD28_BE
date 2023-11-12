module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
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
  });

  Product.associate = (models) => {
    // Thiết lập quan hệ một-nhiều với mô hình "Product_Color"
    Product.hasMany(models.Product_Color, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "colorProducts",
    });
    Product.belongsTo(models.Category, { foreignKey: "CategoryId" });
  };
  return Product;
};

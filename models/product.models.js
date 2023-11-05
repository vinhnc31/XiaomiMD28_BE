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
      type: DataTypes.STRING,
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
    // Thiết lập quan hệ một-nhiều với mô hình "Comment"
    Product.hasMany(models.Comment, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "comments",
    });

    // Thiết lập quan hệ một-nhiều với mô hình "Favorites"
    Product.hasMany(models.Favorites, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "favorites",
    });

    // Thiết lập quan hệ một-nhiều với mô hình "Product_Color"
    Product.hasMany(models.Product_Color, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "colorProducts",
    });
    
    // Thiết lập quan hệ một-nhiều với mô hình "Cart"
    Product.hasMany(models.Cart, {
      onDelete: "CASCADE",
      foreignKey: "productId",
      as: "carts",
    });
  };

  return Product;
};
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Product.init(
        {
            paintId: DataTypes.STRING,
            paintName: DataTypes.STRING,
            paintPrice: DataTypes.STRING,
            paintDiscount: DataTypes.STRING,
            paintQuantity: DataTypes.STRING,
            paintCatelory: DataTypes.STRING,
            paintDescription: DataTypes.STRING,
            image: DataTypes.TEXT("long"),
        },
        {
            sequelize,
            modelName: "Product",
        }
    );
    return Product;
};

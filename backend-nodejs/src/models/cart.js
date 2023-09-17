"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Cart.belongsTo(models.Product, {
                foreignKey: "paintId", targetKey: "paintId", as: "productData",
            });
        }
    }
    Cart.init(
        {
            userId: DataTypes.INTEGER,
            paintId: DataTypes.STRING,
            amount: DataTypes.INTEGER,
            color: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Cart",
        }
    );
    return Cart;
};

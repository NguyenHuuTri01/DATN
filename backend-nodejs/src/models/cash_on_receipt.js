"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CashOnReceipt extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CashOnReceipt.belongsTo(models.Product, {
                foreignKey: "paintId", targetKey: "paintId", as: "cashProduct",
            });
            CashOnReceipt.belongsTo(models.Customer, {
                foreignKey: "transactionId", targetKey: "transactionId", as: "customerCash",
            });
            CashOnReceipt.belongsTo(models.User, { foreignKey: "userId", targetKey: "id", as: "userCash" });
        }
    }
    CashOnReceipt.init(
        {
            userId: DataTypes.INTEGER,
            paintId: DataTypes.STRING,
            amount: DataTypes.INTEGER,
            color: DataTypes.STRING,
            makePrice: DataTypes.STRING,
            discount: DataTypes.STRING,
            transactionId: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "CashOnReceipt",
        }
    );
    return CashOnReceipt;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PayPaypal extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PayPaypal.belongsTo(models.Product, {
                foreignKey: "paintId", targetKey: "paintId", as: "productPaypal",
            });
            PayPaypal.belongsTo(models.Customer, {
                foreignKey: "transactionId", targetKey: "transactionId", as: "customerPaypal",
            });
            PayPaypal.belongsTo(models.User, { foreignKey: "userId", targetKey: "id", as: "userPaypal" });
        }
    }
    PayPaypal.init(
        {
            userId: DataTypes.INTEGER,
            paintId: DataTypes.STRING,
            amount: DataTypes.INTEGER,
            color: DataTypes.STRING,
            makePrice: DataTypes.STRING,
            discount: DataTypes.STRING,
            transactionId: DataTypes.STRING,
            payerEmail: DataTypes.STRING,
            paymentStatus: DataTypes.STRING,
            paymentAmount: DataTypes.STRING,
            currencyCode: DataTypes.STRING,
            paymentDate: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "PayPaypal",
        }
    );
    return PayPaypal;
};

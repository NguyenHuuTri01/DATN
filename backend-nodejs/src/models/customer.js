"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Customer.hasMany(models.PayPaypal, { foreignKey: "transactionId", as: "customerPaypal" });
            Customer.hasMany(models.CashOnReceipt, { foreignKey: "transactionId", as: "customerCash" });
        }
    }
    Customer.init(
        {
            userId: DataTypes.INTEGER,
            userName: DataTypes.STRING,
            transactionId: DataTypes.STRING,
            email: DataTypes.STRING,
            address: DataTypes.STRING,
            phonenumber: DataTypes.STRING,
            typePayment: DataTypes.STRING,
            transportStatus: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Customer",
        }
    );
    return Customer;
};

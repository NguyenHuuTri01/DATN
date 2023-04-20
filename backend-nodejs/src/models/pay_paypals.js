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
        }
    }
    PayPaypal.init(
        {
            userId: DataTypes.INTEGER,
            paintId: DataTypes.STRING,
            amount: DataTypes.INTEGER,
            color: DataTypes.STRING,
            transactionId: DataTypes.STRING,
            payerEmail: DataTypes.STRING,
            paymentStatus: DataTypes.STRING,
            paymentAmount: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "PayPaypal",
        }
    );
    return PayPaypal;
};

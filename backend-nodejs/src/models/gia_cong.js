"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class GiaCong extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    GiaCong.init(
        {
            customerName: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            address: DataTypes.TEXT("long"),
            phonenumber: DataTypes.STRING,
            email: DataTypes.STRING,
            loaiCongTrinh: DataTypes.STRING,
            area: DataTypes.STRING,
            color: DataTypes.STRING,
            startDate: DataTypes.STRING,
            endDate: DataTypes.STRING,
            require: DataTypes.TEXT("long"),
            status: DataTypes.STRING,
            constructorId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "GiaCong",
        }
    );
    return GiaCong;
};

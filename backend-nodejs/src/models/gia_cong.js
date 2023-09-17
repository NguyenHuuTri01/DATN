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
            GiaCong.belongsTo(models.PaintPack, { foreignKey: "paintPack", targetKey: "id", as: "dataPaintPack" });
        }
    }
    GiaCong.init(
        {
            userId: DataTypes.INTEGER,
            customerName: DataTypes.STRING,
            address: DataTypes.TEXT("long"),
            phonenumber: DataTypes.STRING,
            email: DataTypes.STRING,
            loaiCongTrinh: DataTypes.STRING,
            area: DataTypes.STRING,
            startDate: DataTypes.STRING,
            endDate: DataTypes.STRING,
            require: DataTypes.TEXT("long"),
            paintPack: DataTypes.INTEGER,
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

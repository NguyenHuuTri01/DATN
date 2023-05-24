"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PaintDiscount extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    PaintDiscount.init(
        {
            paintId: DataTypes.STRING,
            startDate: DataTypes.DATE,
            endDate: DataTypes.DATE,
            valueDiscount: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "PaintDiscount",
        }
    );
    return PaintDiscount;
};

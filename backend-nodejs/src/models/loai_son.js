"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class LoaiSon extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    LoaiSon.init(
        {
            paintId: DataTypes.STRING,
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "LoaiSon",
        }
    );
    return LoaiSon;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PaintPack extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            PaintPack.hasMany(models.GiaCong, { foreignKey: "paintPack", as: "dataPaintPack" });
        }
    }
    PaintPack.init(
        {
            name: DataTypes.STRING,
            contentHTML: DataTypes.TEXT("long"),
            contentMarkdown: DataTypes.TEXT("long"),
        },
        {
            sequelize,
            modelName: "PaintPack",
        }
    );
    return PaintPack;
};

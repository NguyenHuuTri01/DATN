"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Message.belongsTo(models.User, { foreignKey: "senderId", targetKey: "id", as: "userMessage" });
        }
    }
    Message.init(
        {
            senderId: DataTypes.INTEGER,
            receiverId: DataTypes.INTEGER,
            message: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Message",
        }
    );
    return Message;
};

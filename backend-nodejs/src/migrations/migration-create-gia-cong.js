"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("GiaCongs", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            customerName: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.TEXT("long"),
            },
            phonenumber: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            loaiCongTrinh: {
                type: Sequelize.STRING,
            },
            area: {
                type: Sequelize.STRING,
            },
            startDate: {
                type: Sequelize.STRING,
            },
            endDate: {
                type: Sequelize.STRING,
            },
            require: {
                type: Sequelize.TEXT("long"),
            },
            paintPack: {
                type: Sequelize.INTEGER,
            },
            status: {
                type: Sequelize.STRING,
            },
            constructorId: {
                type: Sequelize.INTEGER,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("GiaCongs");
    },
};

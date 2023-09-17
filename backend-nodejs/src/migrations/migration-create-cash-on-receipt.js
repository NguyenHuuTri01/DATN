"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("CashOnReceipts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            paintId: {
                type: Sequelize.STRING,
            },
            amount: {
                type: Sequelize.INTEGER,
            },
            color: {
                type: Sequelize.STRING,
            },
            makePrice: {
                type: Sequelize.STRING,
            },
            discount: {
                type: Sequelize.STRING,
            },
            transactionId: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("CashOnReceipts");
    },
};

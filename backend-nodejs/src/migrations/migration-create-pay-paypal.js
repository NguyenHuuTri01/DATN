"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("PayPaypals", {
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
            payerEmail: {
                type: Sequelize.STRING,
            },
            paymentStatus: {
                type: Sequelize.STRING,
            },
            paymentAmount: {
                type: Sequelize.STRING,
            },
            currencyCode: {
                type: Sequelize.STRING,
            },
            paymentDate: {
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
        await queryInterface.dropTable("PayPaypals");
    },
};

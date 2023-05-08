"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Products", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            paintId: {
                type: Sequelize.STRING,
            },
            paintName: {
                type: Sequelize.STRING,
            },
            paintPrice: {
                type: Sequelize.STRING,
            },
            paintDiscount: {
                type: Sequelize.STRING,
            },
            paintQuantity: {
                type: Sequelize.STRING,
            },
            paintCatelory: {
                type: Sequelize.STRING,
            },
            paintDescription: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.BLOB("long"),
            },
            numberSold: {
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
        await queryInterface.dropTable("Products");
    },
};

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
                type: Sequelize.DOUBLE,
            },
            paintDiscount: {
                type: Sequelize.INTEGER,
            },
            paintQuantity: {
                type: Sequelize.INTEGER,
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

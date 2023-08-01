import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("servicePlanMappings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      serviceId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "services",
          key: "id",
        },
      },
      planPriceId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "planPrices",
          key: "id",
        },
      },
      planNameId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "planNames",
          key: "id",
        },
      },
      planSpeedId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "planSpeeds",
          key: "id",
        },
      },
      start: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable("servicePlanMappings"),
};

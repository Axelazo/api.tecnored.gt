import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("planSpeeds", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      speed: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      realSpeed: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      start: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      planId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "plans",
          key: "id",
        },
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
    queryInterface.dropTable("planSpeeds"),
};

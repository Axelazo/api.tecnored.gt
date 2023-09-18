import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("tickets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      priority: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      reasonId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "ticketReasons",
          key: "id",
        },
      },
      customReason: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      estimatedStart: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      estimatedFinish: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      serviceId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "services",
          key: "id",
        },
      },
      creatorId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "users",
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
    queryInterface.dropTable("tickets"),
};

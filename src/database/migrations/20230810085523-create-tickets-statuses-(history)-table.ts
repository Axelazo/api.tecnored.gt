import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("ticketStatuses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      ticketId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "tickets",
          key: "id",
        },
      },
      statusId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "ticketStatus",
          key: "id",
        },
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
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
    queryInterface.dropTable("ticketStatuses"),
};

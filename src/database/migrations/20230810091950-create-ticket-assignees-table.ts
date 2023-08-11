import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("ticketAssignees", {
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
      assigneeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "employees",
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
    queryInterface.dropTable("ticketAssignees"),
};

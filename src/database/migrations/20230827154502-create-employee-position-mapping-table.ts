import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("employeePositionMappings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      employeeId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "employees",
          key: "id",
        },
      },
      establishmentId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "establishments",
          key: "id",
        },
      },
      areaId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "areas",
          key: "id",
        },
      },
      positionId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "positions",
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
    queryInterface.dropTable("employeePositionMappings"),
};

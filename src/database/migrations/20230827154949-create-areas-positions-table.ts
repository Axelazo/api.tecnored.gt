import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("areaPositions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      areaId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "establishmentAreas",
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
    queryInterface.dropTable("areaPositions"),
};

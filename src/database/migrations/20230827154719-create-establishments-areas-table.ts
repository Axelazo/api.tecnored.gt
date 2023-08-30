import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("establishmentAreas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
    queryInterface.dropTable("establishmentAreas"),
};

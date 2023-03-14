import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("statuses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
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
    queryInterface.dropTable("statuses"),
};

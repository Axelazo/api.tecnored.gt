import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("plans", {
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
      speed: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      realSpeed: {
        allowNull: false,
        type: DataTypes.FLOAT,
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
    queryInterface.dropTable("plans"),
};

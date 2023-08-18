import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("services", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      serviceNumber: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      ipAddress: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      routerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "routers",
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
    queryInterface.dropTable("services"),
};

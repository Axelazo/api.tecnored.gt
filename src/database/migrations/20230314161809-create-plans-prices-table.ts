import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("plansPrices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      clientId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "clients",
          key: "id",
        },
      },
      serviceId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "services",
          key: "id",
        },
      },
      start: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      end: {
        allowNull: true,
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
    queryInterface.dropTable("plansPrices"),
};

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("serviceslocations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      latitude: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      longitude: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      addressId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "servicesAddresses",
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
    queryInterface.dropTable("serviceslocations"),
};

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("addresses", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      type: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      street: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      city: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      state: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      zipCode: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      personId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "persons",
          key: "id",
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable("addresses"),
};

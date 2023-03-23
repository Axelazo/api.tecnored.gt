import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("persons", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      firstNames: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastNames: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      birthday: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      nitNumber: {
        allowNull: true,
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
    queryInterface.dropTable("persons"),
};

import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("dpis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      number: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      dpiFrontUrl: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      dpiBackUrl: {
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
      deletedAt: {
        type: DataTypes.DATE,
      },
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable("dpis"),
};

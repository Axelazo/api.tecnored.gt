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
      locality: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      departmentId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "departments",
          key: "id",
        },
      },
      municipalityId: {
        allowNull: true,
        type: DataTypes.INTEGER,
        references: {
          model: "municipalities",
          key: "id",
        },
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
      deletedAt: {
        type: DataTypes.DATE,
      },
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable("addresses"),
};

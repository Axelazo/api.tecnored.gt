import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("salaries", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
      },
      amount: {
        allowNull: false,
        type: DataTypes.FLOAT, // Adjust the data type according to your needs (e.g., FLOAT, DECIMAL, etc.).
      },
      employeeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "employees",
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
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable("salaries"),
};

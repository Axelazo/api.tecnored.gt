import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("employeeAllowances", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      allowanceId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "allowances",
          key: "id",
        },
      },
      payrollItemId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "payrollItems",
          key: "id",
        },
      },
      amount: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    }),

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable("employeeAllowances"),
};

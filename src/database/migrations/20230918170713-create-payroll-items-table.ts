import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.createTable("payrollItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      payrollId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "payrolls",
          key: "id",
        },
      },
      month: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      salary: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      allowancesAmount: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      deductionsAmount: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      net: {
        allowNull: false,
        type: DataTypes.FLOAT,
      },
      employeeId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "employees",
          key: "id",
        },
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
    queryInterface.dropTable("payrollItems"),
};

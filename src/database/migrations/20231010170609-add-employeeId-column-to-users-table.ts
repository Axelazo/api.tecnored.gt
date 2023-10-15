import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) =>
    queryInterface.addColumn("users", "employeeId", {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "employees",
        key: "id",
      },
    }),

  down: (queryInterface: QueryInterface) =>
    queryInterface.removeColumn("users", "employeeId"),
};

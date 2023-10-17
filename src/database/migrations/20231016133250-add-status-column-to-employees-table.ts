import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) =>
    queryInterface.addColumn("employees", "status", {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
    }),

  down: (queryInterface: QueryInterface) =>
    queryInterface.removeColumn("employees", "status"),
};

import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("employeeAllowances", [
        {
          allowanceId: 2,
          payrollItemId: 1,
          amount: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          allowanceId: 2,
          payrollItemId: 1,
          amount: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          allowanceId: 2,
          payrollItemId: 1,
          amount: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          allowanceId: 2,
          payrollItemId: 2,
          amount: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          allowanceId: 2,
          payrollItemId: 2,
          amount: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          allowanceId: 2,
          payrollItemId: 2,
          amount: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          allowanceId: 2,
          payrollItemId: 2,
          amount: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkDelete("employeeAllowances", {}, {}),
    ]);
  },
};

import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("employeeDeductions", [
        {
          deductionId: 2,
          payrollItemId: 1,
          amount: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkDelete("employeeDeductions", {}, {}),
    ]);
  },
};

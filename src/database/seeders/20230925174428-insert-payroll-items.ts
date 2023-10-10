import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("payrollItems", [
        {
          payrollId: 1,
          month: "Octubre",
          salary: 3500,
          allowancesAmount: 0,
          deductionsAmount: 0,
          net: 3500,
          employeeId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          payrollId: 1,
          month: "Octubre",
          salary: 4500,
          allowancesAmount: 0,
          deductionsAmount: 0,
          net: 4500,
          employeeId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("payrollItems", {}, {})]);
  },
};

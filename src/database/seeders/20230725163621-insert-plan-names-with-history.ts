import { QueryInterface } from "sequelize";
import subYears from "date-fns/subYears";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("planNames", [
        {
          name: "Plan Basico",
          start: new Date(),
          planId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plan Estandar",
          start: new Date(),
          planId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plan Avanzado",
          start: new Date(),
          planId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plan Deluxe",
          start: new Date(),
          planId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plan Gaming",
          start: subYears(new Date(), 1), // Modify this line to use subYears to subtract one year from the current date
          planId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("planNames", {}, {})]);
  },
};

import { QueryInterface } from "sequelize";
import subYears from "date-fns/subYears";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("planprices", [
        {
          price: 100.0,
          start: new Date(),
          planId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          price: 150.0,
          start: new Date(),
          planId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          price: 200.0,
          start: new Date(),
          planId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          price: 300.0,
          start: new Date(),
          planId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          price: 400.0,
          start: subYears(new Date(), 1), // Modify this line to use subYears to subtract one year from the current date
          planId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("planprices", {}, {})]);
  },
};

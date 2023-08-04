import { QueryInterface } from "sequelize";
import subYears from "date-fns/subYears";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("planSpeeds", [
        {
          speed: 5,
          realSpeed: 4.5,
          start: new Date(),
          planId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          speed: 10,
          realSpeed: 9.0,
          start: new Date(),
          planId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          speed: 15,
          realSpeed: 13.5,
          start: new Date(),
          planId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          speed: 25,
          realSpeed: 22.5,
          start: new Date(),
          planId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          speed: 20,
          realSpeed: 18.0,
          start: subYears(new Date(), 1), // Modify this line to use subYears to subtract one year from the current date
          planId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("planSpeeds", {}, {})]);
  },
};

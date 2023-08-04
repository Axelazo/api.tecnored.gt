import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("plans", [
        {
          name: "Plan Basico",
          speed: 5,
          realSpeed: 4.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plan Estandar",
          speed: 10,
          realSpeed: 9.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plan Avanzado",
          speed: 15,
          realSpeed: 13.5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Plan Gaming",
          speed: 20,
          realSpeed: 18.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("plans", {}, {})]);
  },
};

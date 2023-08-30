import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("areas", [
        {
          name: "Ingeniería",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ventas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Servicio al Cliente",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Contabilidad",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("areas", {}, {})]);
  },
};

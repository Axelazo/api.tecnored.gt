import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("ticketStatus", [
        {
          name: "Instalación Nueva",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Abierto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "En Proceso",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cerrado",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("ticketStatus", {}, {})]);
  },
};

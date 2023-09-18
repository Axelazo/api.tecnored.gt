import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("ticketReasons", [
        {
          name: "No tiene Internet",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Internet lento",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Recolección de equipos",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cambio de contraseña",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cambio de domicilio",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 999,
          name: "Otro",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("ticketReasons", {}, {})]);
  },
};

import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("positions", [
        {
          name: "Técnico de Campo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ayudante de Técnico de Campo",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Atención al Cliente",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jefe de Servicio al Cliente",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Asesor de Sala de Ventas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jefe de Sala de Ventas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jefe de Contabilidad",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Asistente de Contabilidad",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("positions", {}, {})]);
  },
};

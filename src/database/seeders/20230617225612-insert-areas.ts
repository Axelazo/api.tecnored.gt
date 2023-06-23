import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("areas", [
        {
          establishmentId: 1,
          name: "Ingeniería",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 1,
          name: "Ventas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 2,
          name: "Ingeniería",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 2,
          name: "Ventas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 2,
          name: "Ventas en ruta",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 3,
          name: "Ingeniería",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 3,
          name: "Ventas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 3,
          name: "Servicio al Cliente",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 3,
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

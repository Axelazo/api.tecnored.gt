import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("positions", [
        {
          name: "Técnico de Campo",
          areaId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ayudante de Técnico de Campo",
          areaId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Atención al Cliente",
          areaId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Asesor de Sala de Ventas",
          areaId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Técnico de Campo",
          areaId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ayudante de Técnico de Campo",
          areaId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Atención al Cliente",
          areaId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Asesor de Sala de Ventas",
          areaId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Técnico de Campo",
          areaId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Ayudante de Técnico de Campo",
          areaId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Atención al Cliente",
          areaId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Asesor de Sala de Ventas",
          areaId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Atención al Cliente",
          areaId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Atención Especializada al Cliente",
          areaId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jefe de Servicio al Cliente",
          areaId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jefe de Contabilidad",
          areaId: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Asistente de Contabilidad",
          areaId: 9,
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

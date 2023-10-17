import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("deductions", [
        {
          description: "Ajuste",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Inasistencia sin justificación",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Pérdida de recursos o materiales de la empresa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Uso inadecuado de recursos o materiales de la empresa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Incumplimiento de Políticas de la empresa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Otro",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("deductions", {}, {})]);
  },
};

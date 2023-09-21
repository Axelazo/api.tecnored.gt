import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("allowances", [
        {
          description: "Incentivo de Ventas",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          description: "Instalación",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("allowances", {}, {})]);
  },
};

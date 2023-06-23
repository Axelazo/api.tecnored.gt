import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("banks", [
        {
          name: "Banco de Desarrollo Rural S.A.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Banco Industrial S.A.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("banks", {}, {})]);
  },
};

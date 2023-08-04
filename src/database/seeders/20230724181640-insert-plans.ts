import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("plans", [
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
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

import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("usersroles", [
        {
          userId: 1,
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("usersroles", {}, {})]);
  },
};

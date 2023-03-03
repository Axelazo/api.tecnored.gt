import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("roles", [
        {
          roleName: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: "operator",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: "technician",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: "worker",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          roleName: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
      queryInterface.bulkInsert("usersRoles", [
        {
          userId: 1,
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          roleId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          roleId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          roleId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkDelete("usersRoles", {}, {}),
      queryInterface.bulkDelete("roles", {}, {}),
    ]);
  },
};

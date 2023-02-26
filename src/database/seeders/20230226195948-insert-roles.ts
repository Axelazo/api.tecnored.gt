import bcrypt from "bcrypt";
import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      bcrypt.hash("password", 10).then((salted) => {
        queryInterface.bulkInsert(
          "roles",
          [
            {
              roleName: "Admin",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              roleName: "Operator",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              roleName: "Technician",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              roleName: "Employee",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              roleName: "User",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
      }),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.dropTable("roles"),
};

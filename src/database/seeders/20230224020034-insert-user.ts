import bcrypt from "bcrypt";
import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      bcrypt.hash("password", 10).then((salted) => {
        queryInterface.bulkInsert(
          "users",
          [
            {
              firstName: "Axel",
              lastName: "Aguilar",
              email: "admin@tecnored.gt",
              password: salted,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          {}
        );
      }),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> =>
    queryInterface.bulkDelete("users", {}, {}),
};

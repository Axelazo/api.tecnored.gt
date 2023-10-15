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
              firstNames: "Axel Isaí",
              lastNames: "Aguilar Hernández",
              email: "herdezx@gmail.com",
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

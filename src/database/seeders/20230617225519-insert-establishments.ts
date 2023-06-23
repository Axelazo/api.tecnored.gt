import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("establishments", [
        {
          name: "Dolores",
          latitude: "16.5075",
          longitude: "89.4151",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Macháquila",
          latitude: "16.3839",
          longitude: "89.4435",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Calzada Mopán",
          latitude: "16.7259",
          longitude: "89.3799",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("establishments", {}, {})]);
  },
};

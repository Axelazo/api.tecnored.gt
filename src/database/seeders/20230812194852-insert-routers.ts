import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("routers", [
        {
          name: "Router Dolores",
          ipAddress: "192.168.1.1",
          establishmentId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Router Machaquilá",
          ipAddress: "192.168.3.1",
          establishmentId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Router Calzada Mopán",
          ipAddress: "192.168.2.1",
          createdAt: new Date(),
          updatedAt: new Date(),
          establishmentId: 3,
        },
        {
          name: "Router San Francisco",
          ipAddress: "192.168.5.1",
          establishmentId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("routers", {}, {})]);
  },
};

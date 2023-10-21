import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("establishmentAreas", [
        {
          establishmentId: 1,
          areaId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 1,
          areaId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 1,
          areaId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          establishmentId: 1,
          areaId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkDelete("establishmentAreas", {}, {}),
    ]);
  },
};

import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([
      queryInterface.bulkInsert("areaPositions", [
        {
          areaId: 1,
          positionId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 2,
          positionId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 3,
          positionId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 4,
          positionId: 1,
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

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
          areaId: 1,
          positionId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 3,
          positionId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 3,
          positionId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 2,
          positionId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 2,
          positionId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 4,
          positionId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          areaId: 4,
          positionId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("areaPositions", {}, {})]);
  },
};

import { QueryInterface } from "sequelize";

const sampleClient = {
  person: {
    firstNames: "Greisy Adaly",
    lastNames: "Orrego Xol",
    birthday: new Date("1997-10-05"),
    email: "ejemploe@nit.com",
    nitNumber: "96564569",
  },
  address: {
    personId: 1,
    type: 1,
    street: "Barrio Candelaria",
    locality: "Santa Eulalia",
    municipalityId: 150,
    departmentId: 12,
    zipCode: "17001",
  },
  dpi: {
    personId: 1,
    number: 3249461711705,
    dpiFrontUrl: "http://localhost:4000/protected/images/1.jpg",
    dpiBackUrl: "http://localhost:4000/protected/images/2.jpg",
  },
  phones: [
    { personId: 1, type: "Teléfono", number: "55375950" },
    { personId: 1, type: "Celular", number: "46502525" },
  ],
  client: {
    personId: 1,
    clientNumber: 13456879,
  },
};

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<number | object> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const person = await queryInterface.bulkInsert(
        "persons",
        [
          {
            ...sampleClient.person,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      const address = await queryInterface.bulkInsert(
        "addresses",
        [
          {
            ...sampleClient.address,
            personId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      const dpi = await queryInterface.bulkInsert(
        "dpis",
        [
          {
            ...sampleClient.dpi,
            personId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      const phones = await Promise.all(
        sampleClient.phones.map(async (phone) => {
          return queryInterface.bulkInsert(
            "phones",
            [
              {
                ...phone,
                personId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            { transaction }
          );
        })
      );

      const client = await queryInterface.bulkInsert(
        "clients",
        [
          {
            ...sampleClient.client,
            personId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      await transaction.commit();
      return [person, address, dpi, ...phones, client];
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface): Promise<number | object> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete("clients", {}, { transaction });
      await Promise.all([
        queryInterface.bulkDelete("phones", {}, { transaction }),
        queryInterface.bulkDelete("dpis", {}, { transaction }),
        queryInterface.bulkDelete("addresses", {}, { transaction }),
        queryInterface.bulkDelete("persons", {}, { transaction }),
      ]);

      await transaction.commit();
      return 0;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

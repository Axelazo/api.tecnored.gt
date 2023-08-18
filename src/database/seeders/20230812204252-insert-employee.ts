import { QueryInterface } from "sequelize";

const sampleEmployee = {
  person: {
    firstNames: "Joselin Araceli",
    lastNames: "Barrientos de la Cruz",
    birthday: new Date("1999-11-17"),
    email: "barrientosaracely008@gmail.com",
    nitNumber: "96562267",
  },
  address: {
    personId: 2,
    type: 1,
    street: "Calle de la Cancha Intergol ",
    locality: "Barrio San Isidro",
    departmentId: 12,
    municipalityId: 150,
    zipCode: "17005",
  },
  dpi: {
    personId: 2,
    number: 3249461711702,
    dpiFrontUrl:
      "http://localhost:4000/public/bbaf83b5-7f4e-4b27-ae4b-be7f7853ee7e-img-20230320-wa0038.jpg",
    dpiBackUrl:
      "http://localhost:4000/public/0d96c69d-539c-4cf7-80b7-6e0253aeb68f-img-20230320-wa0038.jpg",
  },
  phones: [
    { personId: 2, type: "Teléfono", number: "55375929" },
    { personId: 2, type: "Celular", number: "46504555" },
  ],
  employee: {
    personId: 2,
    employeeNumber: 14772707,
    profileUrl:
      "http://localhost:4000/public/905437f6-3a8a-4ee1-a57f-c5d1d60a0405-img-20190526-wa0084~2.jpg",
    positionId: 8,
  },
  salary: {
    employeeId: 1,
    amount: 3500,
    start: new Date(),
  },
  account: {
    employeeId: 1,
    number: "55555555",
    bankId: 2,
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
            ...sampleEmployee.person,
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
            ...sampleEmployee.address,
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
            ...sampleEmployee.dpi,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      const phones = await Promise.all(
        sampleEmployee.phones.map(async (phone) => {
          return queryInterface.bulkInsert(
            "phones",
            [
              {
                ...phone,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            { transaction }
          );
        })
      );

      const employee = await queryInterface.bulkInsert(
        "employees",
        [
          {
            ...sampleEmployee.employee,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      const salary = await queryInterface.bulkInsert(
        "salaries",
        [
          {
            ...sampleEmployee.salary,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      const account = await queryInterface.bulkInsert(
        "accounts",
        [
          {
            ...sampleEmployee.account,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      await transaction.commit();
      return [person, address, dpi, ...phones, employee, salary, account];
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface): Promise<number | object> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete("salaries", {}, { transaction });
      await queryInterface.bulkDelete("accounts", {}, { transaction });
      await queryInterface.bulkDelete("employees", {}, { transaction });
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

import bcrypt from "bcrypt";
import { QueryInterface } from "sequelize";

const hash = bcrypt.hashSync("password", 10);

const employees = [
  {
    user: {
      firstNames: "Walter Iván",
      lastNames: "Aguilar Hernández",
      email: "walter.aguilar@tecnored.gt",
      password: hash,
      employeeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    person: {
      firstNames: "Walter Iván",
      lastNames: "Aguilar Hernández",
      birthday: new Date("1999-11-17"),
      email: "walivagu@gmail.com",
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
    employeePositionMappings: {
      employeeId: 1,
      establishmentId: 1,
      areaId: 2,
      positionId: 4,
    },
  },
  {
    user: {
      firstNames: "Anthony Gonzalo",
      lastNames: "Barrientos de la Cruz",
      email: "anthony.barrientos@tecnored.gt",
      password: hash,
      employeeId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    person: {
      firstNames: "Anthony",
      lastNames: "Barrientos",
      birthday: new Date("2006-01-12"),
      email: "anthonybarrientos@gmail.com",
      nitNumber: "30542560",
    },
    address: {
      personId: 3,
      type: 1,
      street: "Calle de la Cancha Intergol ",
      locality: "Barrio San Isidro",
      departmentId: 12,
      municipalityId: 150,
      zipCode: "17005",
    },
    dpi: {
      personId: 3,
      number: 1234987694318,
      dpiFrontUrl:
        "http://localhost:4000/public/bbaf83b5-7f4e-4b27-ae4b-be7f7853ee7e-img-20230320-wa0038.jpg",
      dpiBackUrl:
        "http://localhost:4000/public/0d96c69d-539c-4cf7-80b7-6e0253aeb68f-img-20230320-wa0038.jpg",
    },
    phones: [
      { personId: 3, type: "Teléfono", number: "12359876" },
      { personId: 3, type: "Celular", number: "56783467" },
    ],
    employee: {
      personId: 3,
      employeeNumber: 13768305,
      profileUrl:
        "http://localhost:4000/public/905437f6-3a8a-4ee1-a57f-c5d1d60a0405-img-20190526-wa0084~2.jpg",
    },
    salary: {
      employeeId: 2,
      amount: 4500,
      start: new Date(),
    },
    account: {
      employeeId: 2,
      number: "666666",
      bankId: 2,
    },
    employeePositionMappings: {
      employeeId: 2,
      establishmentId: 1,
      areaId: 2,
      positionId: 4,
    },
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<number | object> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const insertedData = [];

      for (const sampleEmployee of employees) {
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

        const employeePositionMapping = await queryInterface.bulkInsert(
          "employeePositionMappings",
          [
            {
              ...sampleEmployee.employeePositionMappings,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { transaction }
        );

        const user = await queryInterface.bulkInsert(
          "users",
          [
            {
              ...sampleEmployee.user,
            },
          ],
          { transaction }
        );

        const userRoles = await queryInterface.bulkInsert(
          "usersRoles",
          [
            {
              roleId: 4, //hardcoded 4 worker value
              userId: sampleEmployee.user.employeeId + 1,
            },
          ],
          { transaction }
        );

        insertedData.push([
          person,
          address,
          dpi,
          ...phones,
          employee,
          salary,
          account,
          employeePositionMapping,
          user,
          userRoles,
        ]);
      }

      await transaction.commit();
      return insertedData.flat();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface): Promise<number | object> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete(
        "employeePositionMappings",
        {},
        { transaction }
      );
      await queryInterface.bulkDelete("usersRoles", {}, { transaction });
      await queryInterface.bulkDelete("users", {}, { transaction });
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

import { QueryInterface } from "sequelize";
import { addMonths, startOfDay, endOfMonth } from "date-fns";

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<number | object> => {
    const currentDate = new Date();
    const timezone = "America/Guatemala"; // Specify the Guatemala timezone
    const payrolls = [];

    for (let i = 0; i < 6; i++) {
      const currentMonthStartDate = startOfDay(addMonths(currentDate, i));
      const nextMonthEndDate = endOfMonth(addMonths(currentDate, i + 1));
      const status = 1;

      payrolls.push({
        from: currentMonthStartDate,
        to: nextMonthEndDate,
        status,
        createdAt: currentDate,
        updatedAt: currentDate,
      });
    }

    return Promise.all([queryInterface.bulkInsert("payrolls", payrolls)]);
  },

  down: async (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("payrolls", {}, {})]);
  },
};

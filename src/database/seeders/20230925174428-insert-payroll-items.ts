import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { QueryInterface } from "sequelize";
import { capitalizeFirstLetter } from "../../utils/generation";
import { es } from "date-fns/locale";

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => {
    const currentDate = new Date();
    const currentMonthStartDate = startOfDay(startOfMonth(currentDate));

    // Grabs the current month
    const month = capitalizeFirstLetter(
      format(currentMonthStartDate, "MMMM", { locale: es })
    );

    return Promise.all([
      queryInterface.bulkInsert("payrollItems", [
        {
          payrollId: 1,
          month: month,
          salary: 3500,
          allowancesAmount: 0,
          deductionsAmount: 0,
          net: 3500,
          employeeId: 1,
          createdAt: currentMonthStartDate,
          updatedAt: currentMonthStartDate,
        },
        {
          payrollId: 1,
          month: month,
          salary: 4500,
          allowancesAmount: 0,
          deductionsAmount: 0,
          net: 4500,
          employeeId: 2,
          createdAt: currentMonthStartDate,
          updatedAt: currentMonthStartDate,
        },
        {
          payrollId: 1,
          month: month,
          salary: 4500,
          allowancesAmount: 0,
          deductionsAmount: 0,
          net: 4500,
          employeeId: 3,
          createdAt: currentMonthStartDate,
          updatedAt: currentMonthStartDate,
        },
      ]),
    ]);
  },

  down: (queryInterface: QueryInterface): Promise<number | object> => {
    return Promise.all([queryInterface.bulkDelete("payrollItems", {}, {})]);
  },
};

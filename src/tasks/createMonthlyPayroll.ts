import cron from "node-cron";
import { isFirstDayOfMonth, format, startOfMonth, endOfMonth } from "date-fns";
import {
  Employee,
  Payroll,
  PayrollItem,
  Salary,
} from "../models/Relationships";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import { capitalizeFirstLetter } from "../utils/generation";
import { es } from "date-fns/locale";

/**
 *
 * Creates the Payroll for the current month.
 *
 **/
export default function createMonthlyPayroll() {
  cron.schedule("5 0 1-1 * *", async () => {
    console.log(
      `[server]: ⚡️ TecnoRedMS API - Succesfully created new payroll`
    );
    const currentDate = new Date();
    if (!isFirstDayOfMonth(currentDate)) {
      return;
    }

    const month = capitalizeFirstLetter(
      format(currentDate, "MMMM", { locale: es })
    );

    try {
      sequelize.transaction(async (t: Transaction) => {
        const newPayroll = await Payroll.create(
          {
            from: startOfMonth(currentDate),
            to: endOfMonth(currentDate),
            status: 1,
          },
          {
            transaction: t,
          }
        );

        const existingEmployees = await Employee.findAll({
          include: [
            {
              model: Salary,
              as: "salaries",
            },
          ],
          transaction: t,
        });

        if (existingEmployees.length < 0) {
          return;
        }

        for (const existingEmployee of existingEmployees) {
          const newPayrollItem = await PayrollItem.create(
            {
              payrollId: newPayroll.id,
              month,
              salary: existingEmployee.salaries[0].amount,
              allowancesAmount: 0,
              deductionsAmount: 0,
              net: existingEmployee.salaries[0].amount,
              employeeId: existingEmployee.id,
            },
            { transaction: t }
          );
        }
      });
    } catch (error) {
      return;
    }
  });
}

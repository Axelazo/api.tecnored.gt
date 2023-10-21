import cron from "node-cron";
import {
  isLastDayOfMonth,
  format,
  differenceInCalendarDays,
  endOfMonth,
} from "date-fns";
import {
  Employee,
  EmployeeAllowance,
  EmployeeDeduction,
  Payroll,
  PayrollItem,
  Person,
  Salary,
} from "../models/Relationships";
import ProcessedPayroll from "../models/ProcessedPayroll";
import { IProcessedPayroll } from "../ts/interfaces/app-interfaces";
import { mergeProcessedPayrolls } from "../utils/misc";
import { capitalizeFirstLetter } from "../utils/generation";
import { es } from "date-fns/locale";

/**
 *
 * Process the Payroll for the current month 1.
 * TODO: Get URL prefix from db
 * TODO: Move DPI image files to a subfolder in the public route
 *
 **/
export default function processMonthlyPayroll() {
  cron.schedule("55 23 * * *", async () => {
    const currentDate = new Date();
    if (!isLastDayOfMonth(currentDate)) {
      return;
    }

    const mostRecentPayroll = await Payroll.findOne({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: PayrollItem,
          as: "items",
          include: [
            {
              model: Employee,
              as: "employee",
              include: [
                {
                  model: Person,
                  as: "person",
                },
                {
                  model: Salary,
                  as: "salaries",
                },
              ],
            },
            {
              model: EmployeeAllowance,
              as: "allowances",
            },
            {
              model: EmployeeDeduction,
              as: "deductions",
            },
          ],
        },
      ],
    });

    if (!mostRecentPayroll) {
      console.log(
        `[server]: ⚡️ TecnoRedMS API - La planilla mas reciente no fue encontrada`
      );
      return;
    }

    const existingProcessedPayroll = await ProcessedPayroll.findOne({
      where: {
        payrollId: mostRecentPayroll.id,
      },
    });

    let existingPayrollData: IProcessedPayroll = {
      payrollId: 0,
      net: 0,
      month: "",
      period: "",
      sum: 0,
      allowances: 0,
      deductions: 0,
      employees: [],
    };

    const newPayrollData: IProcessedPayroll = {
      payrollId: 0,
      net: 0,
      month: "",
      period: "",
      sum: 0,
      allowances: 0,
      deductions: 0,
      employees: [],
    };

    if (existingProcessedPayroll) {
      // payroll exists, data needs to be retrieved and added
      existingPayrollData = JSON.parse(existingProcessedPayroll.data);
    }

    let net = 0;
    let allowances = 0;
    let deductions = 0;

    if (!mostRecentPayroll) {
      console.log(`[server]: ⚡️ TecnoRedMS API - No existe la planilla`);
      return;
    }

    const month = capitalizeFirstLetter(
      format(mostRecentPayroll.from, "MMMM", { locale: es })
    );

    const period = `${format(mostRecentPayroll.from, "dd/MM/yyyy")} al ${format(
      mostRecentPayroll.to,
      "dd/MM/yyyy"
    )}`;

    mostRecentPayroll.items?.map((item) => {
      net += item.net;

      item.allowances?.map((employeeAllowance) => {
        allowances += employeeAllowance.amount;
      });

      item.deductions?.map((employeeDeduction) => {
        deductions += employeeDeduction.amount;
      });
    });

    const payrollItems = mostRecentPayroll.items.map((item, index) => {
      let allowancesAmount = 0;
      let deductionsAmount = 0;

      item.allowances?.map((employeeAllowance) => {
        allowancesAmount += employeeAllowance.amount;
      });

      item.deductions?.map((employeeDeductions) => {
        deductionsAmount += employeeDeductions.amount;
      });

      let salary = 0;
      // If the Salaries array is greater than one we need to:
      // Check if the most recent Salary was created during this month
      // Filter the Salary

      // If the PayrollItem was not created on the same day, that means the employee was created during the month, salary needs to be adjusted by the days worked
      const monthlySalary = item.employee.salaries[0].amount;

      const dailySalary = monthlySalary / 30;
      const daysUntilEndOfMonth = Math.abs(
        differenceInCalendarDays(
          item.createdAt,
          endOfMonth(mostRecentPayroll.createdAt)
        )
      );
      salary = dailySalary * daysUntilEndOfMonth;

      newPayrollData.employees?.push({
        id: item.employee.id,
        firstNames: item.employee.person?.firstNames,
        lastNames: item.employee.person?.lastNames,
        salary,
        allowances: allowancesAmount,
        deductions: deductionsAmount,
        from: format(item.employee.createdAt, "dd-MM-yyyy"),
        to: format(endOfMonth(item.employee.createdAt), "dd-MM-yyyy"),
        deleted: false,
      });

      return {
        index: index + 1,
        firstNames: item.employee.person?.firstNames,
        lastNames: item.employee.person?.lastNames,
        mostRecentSalary: salary,
        allowancesAmount,
        deductionsAmount,
      };
    });

    // New data for processed payroll
    newPayrollData.payrollId = mostRecentPayroll.id;
    newPayrollData.month = month;
    newPayrollData.period = period;

    newPayrollData.net = net;
    newPayrollData.sum = net + allowances - deductions;
    newPayrollData.allowances = allowances;
    newPayrollData.deductions = deductions;

    const data = mergeProcessedPayrolls(newPayrollData, existingPayrollData);

    // If no existing processed payroll, create it
    if (!existingProcessedPayroll) {
      const newProcessedPayroll = await ProcessedPayroll.create({
        payrollId: 1,
        data: JSON.stringify(data),
      });
    } else {
      // Merge existing records
      existingProcessedPayroll.data = JSON.stringify(data);
      existingProcessedPayroll.save();
    }

    console.log(
      `[server]: ⚡️ TecnoRedMS API - Payroll for ${month} processed succesfully`
    );
  });
}

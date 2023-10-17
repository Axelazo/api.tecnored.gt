import { differenceInCalendarDays, startOfMonth } from "date-fns";
import Salary from "../models/Salary";
import { IProcessedPayroll } from "../ts/interfaces/app-interfaces";

/**
 * Calculate the real value by subtracting a specified amount for every given step in the input value.
 * For example, if the value is 10 and the step is 5, and the amount is 0.5,
 * the real value will be 9 (10 - 0.5 - 0.5).
 * If the value is 17 and the step is 5, and the amount is 0.5,
 * the real value will be 14.5 (17 - 0.5 - 0.5 - 0.5).
 *
 * @param {number} value - The input value from which to calculate the real value.
 * @param {number} step - The step for which the specified amount should be subtracted.
 * @param {number} amount - The amount to be subtracted for every given step.
 * @returns {number} The calculated real value.
 */
export function calculateRealValue(
  value: number,
  step: number,
  amount: number
): number {
  return value - Math.floor(value / step) * amount;
}

export function mergeProcessedPayrolls(
  ...payrolls: IProcessedPayroll[]
): IProcessedPayroll {
  const mergedPayroll: IProcessedPayroll = {
    payrollId: 0, // You can set this to a meaningful value or calculate it based on input
    month: "",
    period: "",
    net: 0,
    allowances: 0,
    deductions: 0,
    sum: 0,
    employees: [],
  };

  for (const payroll of payrolls) {
    // Merge employees
    mergedPayroll.month = payrolls[0].month;
    mergedPayroll.period = payrolls[0].period;
    mergedPayroll.payrollId = payrolls[0].payrollId;

    for (const employee of payroll.employees || []) {
      const existingEmployee = mergedPayroll.employees?.find(
        (emp) => emp.id === employee.id
      );

      if (existingEmployee) {
        if (existingEmployee.deleted) {
          //
        } else {
          // Update existing employee entry
          existingEmployee.salary = employee.salary;
          existingEmployee.allowances = employee.allowances;
          existingEmployee.deductions = employee.deductions;
        }
      } else {
        // Add a new employee entry
        mergedPayroll.employees?.push({ ...employee });
      }
    }
  }

  // Recalculate net, allowances, deductions, and sum based on the merged employee data

  if (mergedPayroll) {
    if (mergedPayroll.employees) {
      for (const employee of mergedPayroll.employees) {
        mergedPayroll.net += employee.salary;
        mergedPayroll.allowances += employee.allowances;
        mergedPayroll.deductions += employee.deductions;
      }
    }
  }

  // Calculate the 'sum' based on 'net' and 'allowances' and 'deductions
  mergedPayroll.sum =
    mergedPayroll.net + mergedPayroll.allowances - mergedPayroll.deductions;

  return mergedPayroll;
}

function getValidSalaries(salaries: Salary[], givenDate: Date): Salary[] {
  // Get the start date of the current month
  const currentMonthStart = startOfMonth(givenDate);

  // Separate salaries into two arrays: inside and outside the current month
  const salariesInsideMonth: Salary[] = [];
  const salariesOutsideMonth: Salary[] = [];

  for (const salary of salaries) {
    const distanceInDaysFromStartOfTheMonth = differenceInCalendarDays(
      salary.createdAt,
      currentMonthStart
    );

    if (distanceInDaysFromStartOfTheMonth >= 0) {
      salariesInsideMonth.push(salary);
    } else {
      salariesOutsideMonth.push(salary);
    }
  }

  // Sort the salaries inside the current month by createdAt date in descending order
  salariesInsideMonth.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Include just one salary from the outside the current month, if available
  if (salariesOutsideMonth.length > 0) {
    const closestOutsideSalary = salariesOutsideMonth.reduce(
      (closest, current) => {
        const closestDistance = differenceInCalendarDays(
          closest.createdAt,
          currentMonthStart
        );
        const currentDistance = differenceInCalendarDays(
          current.createdAt,
          currentMonthStart
        );
        return Math.abs(currentDistance) < Math.abs(closestDistance)
          ? current
          : closest;
      }
    );

    salariesInsideMonth.push(closestOutsideSalary);
  } else if (salariesInsideMonth.length === 0 && salaries.length === 1) {
    // Handle the case where there's only one salary (outside of the month)
    salariesInsideMonth.push(salaries[0]);
  } else if (
    salariesInsideMonth.length === 1 &&
    salariesOutsideMonth.length === 1
  ) {
    // Handle the case where there's one salary inside and one outside of the month
    const insideSalary = salariesInsideMonth[0];
    const outsideSalary = salariesOutsideMonth[0];

    const insideDistance = differenceInCalendarDays(
      insideSalary.createdAt,
      currentMonthStart
    );
    const outsideDistance = differenceInCalendarDays(
      outsideSalary.createdAt,
      currentMonthStart
    );

    if (Math.abs(insideDistance) < Math.abs(outsideDistance)) {
      // Include the closest salary inside the month
      salariesInsideMonth[0] = insideSalary;
    } else {
      // Include the closest salary outside the month
      salariesInsideMonth[0] = outsideSalary;
    }
  }

  return salariesInsideMonth;
}

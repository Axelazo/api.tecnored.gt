import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import Payroll from "../models/Payroll";
import {
  Client,
  Employee,
  EmployeeAllowance,
  EmployeeDeduction,
  PayrollItem,
  Person,
  Salary,
  Service,
  ServicesOwners,
  Ticket,
  TicketStatus,
} from "../models/Relationships";
import {
  differenceInCalendarDays,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import TicketReason from "../models/TicketReason";

export const testEndpointForDevelopmentPurposes = async (
  request: AuthRequest,
  response: Response
) => {
  const currentDate = new Date();

  const salaries = [
    {
      createdAt: new Date("01/08/2023"),
      amount: 2800,
    },

    {
      createdAt: new Date(),
      amount: 3800,
    },
    {
      createdAt: new Date("2023-10-01 00:00:00"),
      amount: 3500,
    },
    {
      createdAt: new Date("08/09/2023"),
      amount: 3100,
    },
  ];
  /* 
  // First we sort the array based on the creation date
  salaries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // We filter out the salaries NOT created during the month
  const salariesDuringThisMonth = salaries.filter((salary) =>
    isSameMonth(salary.createdAt, currentDate)
  );

  const dailySalary: string[] = [];

  // Calculate the daily salary for each period
  for (const salary of salariesDuringThisMonth) {
    console.log(salary);
  }
 */
  /* 
  // Filter salaries in the same month and sort them based on createdAt
  const filteredSalaries = salaries.filter(
    (salary) => salary.createdAt.getMonth() === currentDate.getMonth()
  );

  console.log(filteredSalaries);

  filteredSalaries.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  console.log(filteredSalaries);
 */

  try {
    const employee = await Employee.findOne({
      where: {
        id: 1,
      },
      include: [
        {
          model: Salary,
          as: "salaries",
        },
      ],
    });

    /*     const services = await Service.findAll({
      include: [
        {
          model: Client,
          as: "clients",
          include: [
            {
              model: Person,
              as: "person",
            },
          ],
        },
      ],
    }); */
    response.status(200).json({
      data: employee,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: JSON.stringify(error),
    });
  }
};
export default {
  testEndpointForDevelopmentPurposes,
};

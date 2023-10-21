import { Request, Response } from "express";
import {
  AuthRequest,
  IProcessedPayroll,
} from "../ts/interfaces/app-interfaces";
import Payroll from "../models/Payroll";
import {
  EmployeeAllowance,
  EmployeeDeduction,
  PayrollItem,
} from "../models/Relationships";
import Employee from "../models/Employee";
import Person from "../models/Person";
import {
  differenceInCalendarDays,
  endOfMonth,
  format,
  getYear,
} from "date-fns";
import { es } from "date-fns/locale";
import { capitalizeFirstLetter } from "../utils/generation";
import Salary from "../models/Salary";
import * as htmlToPdf from "html-pdf-node-ts";

import ProcessedPayroll from "../models/ProcessedPayroll";
import { mergeProcessedPayrolls } from "../utils/misc";

export const getAllPayrolls = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const payrolls = await Payroll.findAll({
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

    const currenDate = new Date();

    if (payrolls.length > 0) {
      const formattedPayrolls = payrolls.map((payroll) => {
        /*         const processedPayroll = await ProcessedPayroll.findOne({
          where: {
            id: payroll.id,
          },
        }); */

        /*         let existingPayrollData: IProcessedPayroll = {
          payrollId: 0,
          net: 0,
          month: "",
          period: "",
          sum: 0,
          allowances: 0,
          deductions: 0,
          employees: [],
        };

        if (processedPayroll) {
          existingPayrollData.payrollId = processedPayroll.payrollId;
        } */

        let net = 0;
        let allowances = 0;
        let deductions = 0;

        payroll.items?.map((item) => {
          /*           console.log(item.employee.salaries);
          const monthlySalary = item.employee.salaries[0].amount;
          const dailySalary = monthlySalary / 30;
          const interval = Math.abs(
            differenceInCalendarDays(item.createdAt, endOfMonth(currenDate))
          );

          const amountToPayToEndOfMonth = dailySalary * interval; */

          net += item.net;

          item.allowances?.map((employeeAllowance) => {
            allowances += employeeAllowance.amount;
          });

          item.deductions?.map((employeeDeduction) => {
            deductions += employeeDeduction.amount;
          });
        });

        return {
          id: payroll.id,
          from: payroll.from,
          to: payroll.to,
          status: payroll.status,
          net,
          allowances,
          deductions,
        };
      });

      response.status(200).json({ data: formattedPayrolls });
    } else {
      response
        .status(204)
        .json({ message: "No se ha encontrado ninguna planilla!" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getPayrollById = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    const payroll = await Payroll.findByPk(id, {
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

    if (!payroll) {
      response.status(404).json({ message: "No se ha encontrado la planilla" });
      return;
    }
    response.status(200).json({ data: payroll });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const generatePayrollDocument = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  if (!id) {
    return response
      .status(409)
      .json({ message: "El id de la planilla es requerido" });
  }

  const currentDate = new Date();

  const payroll = await Payroll.findOne({
    where: {
      id,
    },
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

  const existingProcessedPayroll = await ProcessedPayroll.findOne({
    where: {
      payrollId: id,
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

  if (!payroll) {
    return response.status(404).json({ message: "No existe la planilla" });
  }

  const month = capitalizeFirstLetter(
    format(payroll.from, "MMMM", { locale: es })
  );

  const period = `${format(payroll.from, "dd/MM/yyyy")} al ${format(
    payroll.to,
    "dd/MM/yyyy"
  )}`;

  payroll.items?.map((item) => {
    net += item.net;

    item.allowances?.map((employeeAllowance) => {
      allowances += employeeAllowance.amount;
    });

    item.deductions?.map((employeeDeduction) => {
      deductions += employeeDeduction.amount;
    });
  });

  const payrollItems = payroll.items.map((item, index) => {
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
      differenceInCalendarDays(item.createdAt, endOfMonth(payroll.createdAt))
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
  newPayrollData.payrollId = payroll.id;
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
    data.allowances = allowances;
    data.deductions = deductions;
    existingProcessedPayroll.data = JSON.stringify(data);
    existingProcessedPayroll.save();
  }

  const htmlTemplate = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Planilla</title>
      <link rel="stylesheet" type="text/css" href="style.css" />
    </head>

    <style>
    html {
      background-color: rgb(168, 168, 168);
    }

    .container {
      padding: 3rem;
      height: 210mm;
      width: 297mm;
      margin-left: auto;
      margin-right: auto;
      background-color: rgb(255, 255, 255);
    }

    table {
      margin-top: 1rem;
      border-collapse: collapse; /* Remove spacing between table cells */
    }

    .payroll-table {
      width: 100%; /* Set the table width to 100% of its container */
      border: 1px solid #000; /* Add a border to the entire table */
    }

    .payroll-table > tr {
      border: 1px solid #000; /* Add a border to each table row */
    }

    .payroll-table th {
      border: 1px solid #000; /* Add a border to table header cells and data cells */
    }

    .payroll-table td {
      border: 1px solid #000; /* Add a border to table header cells and data cells */
    }

    td {
      padding-inline: 8px; /* Add padding to create space inside cells */
    }

    tr > th {
      padding: 8px; /* Add padding to create space inside cells */
      text-align: left; /* Align text to the left within cells */
    }
  </style>
  
    <body>
      <div class="container">
        <h1>Planilla de Pago</h1>
        <div class="description">
          <table>
            <tr>
              <td><b>Periodo:</b></td>
              <td>${data.month} - ${data.period}</td>
            </tr>
            <tr>
              <td><b>Total de Sueldos:</b></td>
              <td>Q${data.net}</td>
            </tr>
            <tr>
              <td><b>Total de Bonificaciones:</b></td>
              <td>Q${data.allowances}</td>
            </tr>
            <tr>
              <td><b>Total de Penalizaciones:</b></td>
              <td>Q${data.deductions}</td>
            </tr>
            <tr>
              <td><b>Monto total a pagar:</b></td>
              <td>Q${data.sum}</td>
            </tr>
          </table>
        </div>
        <table class="payroll-table">
          <tr>
            <th>#</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Salario</th>
            <th>Bonificaciones</th>
            <th>Penalizaciones</th>
          </tr>
          ${data.employees?.map((item) => {
            return `          <tr>
              <td>${item.id}</td>
              <td>${item.firstNames}</td>
              <td>${item.lastNames} ${item.deleted ? "*" : ""}</td>
              <td>Q${item.salary}</td>
              <td>Q${item.allowances}</td>
              <td>Q${item.deductions}</td>
            </tr>`;
          })}
        </table>
        <div>
          <p>
            *El salario (ajustado) es calculado en base a si hubo un
            aumento/disminución de sueldo durante el período de pago, el sueldo
            anterior es divido en el número de días del mes actual, y se
            multiplica por la cantidad de días durante los cuales fue válido, y se
            realiza el mismo procedimiento con el nuevo salario, para sumarse y
            proporcionar el salario ajustado.
          </p>
          <p>
            <b>Ejemplo:</b>
            <br />
            Periodo 01/10/2023 al 31/10/2023 <br />Sueldo de Q2800 del 01/10 al
            17/10 / 31 días =Q90.32~ * 17 días de validez = Q1535.50~
            <br />
            Sueldo de Q3500 del 18/10 al 31/10 / 31 días = Q.112.90~ * 14 días
            restantes = Q1580.60~
            <br />
            Suma = Q3116.10
          </p>
        </div>
      </div>
    </body>
  </html>
  `;

  const filename = `PlanillaMensual-${month}-${getYear(currentDate)}.pdf`;

  response.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}.pdf"`
  );
  response.setHeader("Content-Type", "application/pdf");

  const file = { content: htmlTemplate };

  try {
    const pdfBuffer = await htmlToPdf.generatePdf(file, {
      format: "Letter",
      landscape: true,
    });

    response.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error });
  }
};

export default {
  getAllPayrolls,
  getPayrollById,
  generatePayrollDocument,
};

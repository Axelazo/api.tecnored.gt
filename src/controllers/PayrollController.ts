import { Request, Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
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
  isSameDay,
  startOfMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import { capitalizeFirstLetter } from "../utils/generation";
import Salary from "../models/Salary";
import * as htmlToPdf from "html-pdf-node-ts";
import * as sgMail from "@sendgrid/mail";
import { MailDataRequired, MailService } from "@sendgrid/mail";

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

    if (payrolls.length > 0) {
      const formattedPayrolls = payrolls.map((payroll) => {
        let net = 0;
        let allowances = 0;
        let deductions = 0;

        payroll.items?.map((item) => {
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

  let net = 0;
  let allowances = 0;
  let deductions = 0;

  if (!payroll) {
    return response.status(404).json({ message: "No existe la planilla" });
  }
  payroll.items?.map((item) => {
    net += item.net;

    item.allowances?.map((employeeAllowance) => {
      allowances += employeeAllowance.amount;
    });

    item.deductions?.map((employeeDeduction) => {
      deductions += employeeDeduction.amount;
    });
  });

  const month = capitalizeFirstLetter(
    format(payroll.from, "MMMM", { locale: es })
  );
  const period = `${format(payroll.from, "dd/MM/yyyy")} al ${format(
    payroll.to,
    "dd/MM/yyyy"
  )}`;

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

    return {
      index: index + 1,
      firstNames: item.employee.person?.firstNames,
      lastNames: item.employee.person?.lastNames,
      mostRecentSalary: salary,
      allowancesAmount,
      deductionsAmount,
    };
  });

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
              <td>${month} - ${period}</td>
            </tr>
            <tr>
              <td><b>Total de Sueldos:</b></td>
              <td>Q${net}</td>
            </tr>
            <tr>
              <td><b>Total de Bonificaciones:</b></td>
              <td>Q${allowances}</td>
            </tr>
            <tr>
              <td><b>Total de Penalizaciones:</b></td>
              <td>Q${deductions}</td>
            </tr>
            <tr>
              <td><b>Monto total a pagar:</b></td>
              <td>Q${net + allowances - deductions}</td>
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
          ${payrollItems.map((item) => {
            return `          <tr>
              <td>${item.index}</td>
              <td>${item.firstNames}</td>
              <td>${item.lastNames}</td>
              <td>Q${item.mostRecentSalary}</td>
              <td>Q${item.allowancesAmount}</td>
              <td>Q${item.deductionsAmount}</td>
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

  response.setHeader("Content-Disposition", `attachment; filename="asdf.pdf"`);
  response.setHeader("Content-Type", "application/pdf");

  const file = { content: htmlTemplate };

  try {
    const pdfBuffer = await htmlToPdf.generatePdf(file, {
      format: "Letter",
      landscape: true,
    });

    /*     
    const msg: MailDataRequired = {
      to: "herdezx+1@gmail.com",
      from: "herdezx@gmail.com", // Use the email address or domain you verified above
      subject: "Sending with Twilio SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      attachments: [
        {
          filename: `invoice`,
          content: pdfBuffer.toString(),
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };
    

    await sgMail.send(msg); */
    const mailService = new MailService();

    if (process.env.SENDGRID_API_KEY) {
      mailService.setApiKey(process.env.SENDGRID_API_KEY);
    }

    const msg: MailDataRequired = {
      to: "herdezx+1@gmail.com",
      from: "herdezx@gmail.com", // Use the email address or domain you verified above
      subject: "Sending with Twilio SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      attachments: [
        {
          filename: `invoice`,
          content: pdfBuffer.toString(),
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    /*     await mailService.send(msg);
     */
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

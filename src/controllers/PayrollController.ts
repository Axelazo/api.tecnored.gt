import { Response } from "express";
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
          console.log(item);
          net += item.net;

          item.allowances?.map((employeeAllowance) => {
            allowances += employeeAllowance.amount;
          });

          item.deductions?.map((employeeDeduction) => {
            deductions += employeeDeduction.amount;
          });
        });

        return {
          payroll: payroll.id,
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

export default {
  getAllPayrolls,
  getPayrollById,
};

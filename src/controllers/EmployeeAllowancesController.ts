import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import PayrollItem from "../models/PayrollItem";
import { Allowance, EmployeeAllowance } from "../models/Relationships";
import Employee from "../models/Employee";
import { isAfter } from "date-fns";
import { Op } from "sequelize";

export const createEmployeeAllowance = async (
  request: AuthRequest,
  response: Response
) => {
  const {
    allowanceId,
    employeeId,
    amount,
  }: {
    allowanceId: number;
    employeeId: number;
    amount: number;
  } = request.body;

  if (!allowanceId) {
    const message = `La bonificación es requerida!`;
    response.status(422).json({ message });
    return;
  }

  if (!employeeId) {
    const message = `El empleado es requerido!`;
    response.status(422).json({ message });
    return;
  }

  if (!amount) {
    const message = `El monto de la bonificación requerido!`;
    response.status(422).json({ message });
    return;
  }

  if (amount <= 0) {
    const message = `El monto de la bonificación no puede ser negativo!`;
    response.status(409).json({ message });
    return;
  }

  try {
    sequelize.transaction(async (t: Transaction) => {
      const allowanceExists = Allowance.findOne({
        where: {
          id: allowanceId,
        },
      });

      if (!allowanceExists) {
        const message = `La bonificación indicada no existe!`;
        response.status(409).json({ message });
        return;
      }

      const employeeExists = Employee.findOne({
        where: {
          id: employeeId,
        },
      });

      if (!employeeExists) {
        const message = `El empleado indicado no existe!`;
        response.status(409).json({ message });
        return;
      }

      // Retrieve most recent Payroll Item for the given Employee
      const mostRecentPayrollItem = await PayrollItem.findOne({
        where: { employeeId },
        order: [["createdAt", "DESC"]],
      });

      if (!mostRecentPayrollItem) {
        const message = `Aún no existe la planilla para el empleado indicado!`;
        response.status(409).json({ message });
        return;
      }

      const employeeAllowance = await EmployeeAllowance.create(
        {
          payrollItemId: mostRecentPayrollItem.id,
          allowanceId,
          amount,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: employeeAllowance.id,
      });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getAllEmployeeAllowances = async (
  request: AuthRequest,
  response: Response
) => {
  const { id }: { id?: number } = request.params;
  const { from, to }: { from?: string; to?: string } = request.query;

  if (!id) {
    const message = `El empleado es requerido!`;
    response.status(422).json({ message });
    return;
  }

  try {
    const employeeExists = Employee.findOne({
      where: {
        id,
      },
    });

    if (!employeeExists) {
      const message = `El empleado indicado no existe!`;
      response.status(409).json({ message });
      return;
    }

    const mostRecentPayrollItemWithEmployeeId = await PayrollItem.findOne({
      where: {
        employeeId: id,
      },
      include: [
        {
          model: EmployeeAllowance,
          as: "allowances",
          include: [
            {
              model: Allowance,
              as: "allowance",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!mostRecentPayrollItemWithEmployeeId) {
      return response
        .status(404)
        .json({ message: "No se ha encontrado ninguna bonificación!" });
    }

    if (mostRecentPayrollItemWithEmployeeId.allowances.length > 0) {
      const formattedAllowances =
        mostRecentPayrollItemWithEmployeeId.allowances.map(
          (employeeAllowance) => {
            return {
              id: employeeAllowance.id,
              amount: employeeAllowance.amount,
              description: employeeAllowance.allowance?.description,
              type: "allowance",
              createdAt: employeeAllowance.createdAt,
              updatedAt: employeeAllowance.updatedAt,
              deletedAt: employeeAllowance.deletedAt,
            };
          }
        );
      return response.status(200).json({ data: formattedAllowances });
    } else {
      response
        .status(204)
        .json({ message: "No se ha encontrado ninguna bonificación!" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getAllEmployeesAllowancesAmount = async (
  request: AuthRequest,
  response: Response
) => {
  const { from, to }: { from?: string; to?: string } = request.query;

  if (!from || !to) {
    const message = `Las fechas de inicio y de final son requeridas!`;
    return response.status(409).json({ message });
  }

  if (isAfter(new Date(from), new Date(to))) {
    const message = `La fecha de inicio no puede estar después de la fecha final !`;
    response.status(422).json({ message });
    return;
  }

  try {
    let employeeAllowancesAmount = await EmployeeAllowance.sum("amount", {
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
      },
    });

    employeeAllowancesAmount = employeeAllowancesAmount || 0;

    response.status(200).json({ amount: employeeAllowancesAmount });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const deleteEmployeeAllowance = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    sequelize.transaction(async (t: Transaction) => {
      const employeeAllowance = await EmployeeAllowance.findByPk(id);

      if (!employeeAllowance) {
        response.status(404).json({
          message: "No se ha encontrado la bonificación del empleado",
        });
        return;
      }

      employeeAllowance.destroy({ transaction: t });

      response.status(200).json({ data: employeeAllowance.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export default {
  createEmployeeAllowance,
  getAllEmployeeAllowances,
  deleteEmployeeAllowance,
  getAllEmployeesAllowancesAmount,
};

import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import PayrollItem from "../models/PayrollItem";
import { Deduction, EmployeeDeduction } from "../models/Relationships";
import Employee from "../models/Employee";
import { isAfter } from "date-fns";
import { Op } from "sequelize";

export const createEmployeeDeduction = async (
  request: AuthRequest,
  response: Response
) => {
  const {
    deductionId,
    employeeId,
    amount,
  }: {
    deductionId: number;
    employeeId: number;
    amount: number;
  } = request.body;

  if (!deductionId) {
    const message = `La penalización es requerida!`;
    response.status(422).json({ message });
    return;
  }

  if (!employeeId) {
    const message = `El empleado es requerido!`;
    response.status(422).json({ message });
    return;
  }

  if (!amount) {
    const message = `El monto de la penalización requerido!`;
    response.status(422).json({ message });
    return;
  }

  if (amount <= 0) {
    const message = `El monto de la penalización no puede ser negativo!`;
    response.status(409).json({ message });
    return;
  }

  try {
    sequelize.transaction(async (t: Transaction) => {
      const deductionExists = Deduction.findOne({
        where: {
          id: deductionId,
        },
      });

      if (!deductionExists) {
        const message = `La penalización indicada no existe!`;
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

      const employeeDeduction = await EmployeeDeduction.create(
        {
          payrollItemId: mostRecentPayrollItem.id,
          deductionId,
          amount,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: employeeDeduction.id,
      });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getAllEmployeeDeductions = async (
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
        id,
      },
      include: [
        {
          model: EmployeeDeduction,
          as: "deductions",
          include: [
            {
              model: Deduction,
              as: "deduction",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!mostRecentPayrollItemWithEmployeeId) {
      return response
        .status(404)
        .json({ message: "No se ha encontrado ninguna penalización!" });
    }

    if (mostRecentPayrollItemWithEmployeeId.deductions.length > 0) {
      const formattedDeductions =
        mostRecentPayrollItemWithEmployeeId.deductions.map(
          (employeeDeductions) => {
            return {
              id: employeeDeductions.id,
              amount: employeeDeductions.amount,
              description: employeeDeductions.deduction?.description,
              type: "deduction",
              createdAt: employeeDeductions.createdAt,
              updatedAt: employeeDeductions.updatedAt,
              deletedAt: employeeDeductions.deletedAt,
            };
          }
        );
      return response.status(200).json({ data: formattedDeductions });
    } else {
      response
        .status(204)
        .json({ message: "No se ha encontrado ninguna penalización!" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getAllEmployeesDeductionsAmount = async (
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
    let employeeDeductionsAmount = await EmployeeDeduction.sum("amount", {
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
      },
    });

    employeeDeductionsAmount = employeeDeductionsAmount || 0;

    response.status(200).json({ amount: employeeDeductionsAmount });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const deleteEmployeeDeduction = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    sequelize.transaction(async (t: Transaction) => {
      const employeeDeduction = await EmployeeDeduction.findByPk(id);

      if (!employeeDeduction) {
        response.status(404).json({
          message: "No se ha encontrado la bonificación del empleado",
        });
        return;
      }

      employeeDeduction.destroy({ transaction: t });

      response.status(200).json({ data: employeeDeduction.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export default {
  createEmployeeDeduction,
  getAllEmployeeDeductions,
  deleteEmployeeDeduction,
  getAllEmployeesDeductionsAmount,
};

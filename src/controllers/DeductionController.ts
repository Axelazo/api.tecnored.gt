import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import Deduction from "../models/Deduction";
import { EmployeeDeduction } from "../models/Relationships";

export const createDeduction = async (
  request: AuthRequest,
  response: Response
) => {
  const { description }: { description: string } = request.body;

  try {
    if (!description) {
      const message = `La descripción es requerida!`;
      response.status(422).json({ message });
      return;
    }

    sequelize.transaction(async (t: Transaction) => {
      const duplicatedDeductionName = await Deduction.findOne({
        where: {
          description,
        },
      });

      if (duplicatedDeductionName) {
        const message = `La descripción no puede ser repetida!`;
        response.status(422).json({ message });
        return;
      }

      const deduction = await Deduction.create(
        {
          description,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: deduction.id,
      });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getAllDeductions = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const deductions = await Deduction.findAll({});

    if (deductions.length > 0) {
      response.status(200).json({ data: deductions });
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

export const getDeductionById = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  if (!id) {
    return response.status(409).json({
      message: "La penalización es requerida",
    });
  }

  if (isNaN(parseInt(id))) {
    return response.status(409).json({
      message: "El id especificado debe ser un número",
    });
  }

  try {
    const deduction = await Deduction.findByPk(id);

    if (!deduction) {
      response
        .status(404)
        .json({ message: "No se ha encontrado la penalización" });
      return;
    }
    response.status(200).json({ data: deduction });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const updateDeduction = async (
  request: AuthRequest,
  response: Response
) => {
  const { description } = request.body;
  const { id } = request.params;

  if (!id) {
    return response.status(409).json({
      message: "La penalización es requerida!",
    });
  }

  if (isNaN(parseInt(id))) {
    return response.status(409).json({
      message: "El id especificado debe ser un número!",
    });
  }

  if (!description) {
    response.status(409).json({ message: "La descripción es requerida!" });
    return;
  }

  try {
    sequelize.transaction(async (t: Transaction) => {
      const deduction = await Deduction.findByPk(id);

      if (!deduction) {
        response
          .status(404)
          .json({ message: "No se ha encontrado la penalización" });
        return;
      }

      if (deduction.description === description) {
        response
          .status(409)
          .json({ message: "La descripción no puede ser la misma" });
        return;
      }

      const deductionWithSameDescription = await Deduction.findOne({
        where: { description },
      });

      if (deductionWithSameDescription) {
        response.status(409).json({
          message: "Ya existe una penalización con la misma descripción",
        });
        return;
      }

      deduction.description = description;

      deduction.save({ transaction: t, hooks: true });

      response.status(200).json({ data: deduction.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const deleteDeduction = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  if (!id) {
    return response.status(409).json({
      message: "El id de la penalización es requerida!",
    });
  }

  if (isNaN(parseInt(id))) {
    return response.status(409).json({
      message: "El id especificado debe ser un número!",
    });
  }

  try {
    sequelize.transaction(async (t: Transaction) => {
      const deduction = await Deduction.findByPk(id);

      if (!deduction) {
        response
          .status(404)
          .json({ message: "No se ha encontrado la penalización" });
        return;
      }

      // Check if Deductions are being used in entries on the EmployeeDeductions table
      const deductionsAssociatedWithEmployees = await EmployeeDeduction.findAll(
        {
          where: { deductionId: deduction.id },
        }
      );

      if (deductionsAssociatedWithEmployees.length > 0) {
        response.status(409).json({
          message:
            "Existen servicios asociados al router, modifiquelos primero!",
        });
        return;
      }

      deduction.destroy({ transaction: t });

      response.status(200).json({ data: deduction.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export default {
  createDeduction,
  getAllDeductions,
  getDeductionById,
  updateDeduction,
  deleteDeduction,
};

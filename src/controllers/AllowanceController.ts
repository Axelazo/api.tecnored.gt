import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import Allowance from "../models/Allowance";
import { EmployeeAllowance } from "../models/Relationships";

export const createAllowance = async (
  request: AuthRequest,
  response: Response
) => {
  const { description }: { description: string } = request.body;

  try {
    if (!description) {
      const message = `La descripción es requerida requerido!`;
      response.status(422).json({ message });
      return;
    }

    sequelize.transaction(async (t: Transaction) => {
      const duplicatedAllowanceName = await Allowance.findOne({
        where: {
          description,
        },
      });

      if (duplicatedAllowanceName) {
        const message = `La descripción no puede ser repetida!`;
        response.status(422).json({ message });
        return;
      }

      const allowance = await Allowance.create(
        {
          description,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: allowance.id,
      });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getAllAllowances = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const allowances = await Allowance.findAll({});

    if (allowances.length > 0) {
      response.status(200).json({ data: allowances });
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

export const getAllowanceById = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    const allowance = await Allowance.findByPk(id);

    if (!allowance) {
      response
        .status(404)
        .json({ message: "No se ha encontrado la bonificación" });
      return;
    }
    response.status(200).json({ data: allowance });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const updateAllowance = async (
  request: AuthRequest,
  response: Response
) => {
  const { description } = request.body;
  const { id } = request.params;

  try {
    sequelize.transaction(async (t: Transaction) => {
      const allowance = await Allowance.findByPk(id);

      if (!allowance) {
        response
          .status(404)
          .json({ message: "No se ha encontrado la bonificación" });
        return;
      }

      if (allowance.description === description) {
        response
          .status(409)
          .json({ message: "La descripción no puede ser la misma" });
        return;
      }

      const allowanceWithSameDescription = await Allowance.findOne({
        where: { description },
      });

      if (allowanceWithSameDescription) {
        response.status(409).json({
          message: "Ya existe una bonificación con la misma descripción",
        });
        return;
      }

      allowance.description = description;

      allowance.save({ transaction: t, hooks: true });

      response.status(200).json({ data: allowance.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const deleteAllowance = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    sequelize.transaction(async (t: Transaction) => {
      const allowance = await Allowance.findByPk(id);

      if (!allowance) {
        response
          .status(404)
          .json({ message: "No se ha encontrado la bonificación" });
        return;
      }

      // Check if Allowances are being used in entries on the EmployeeAllowances table
      const allowancesAssociatedWithEmployees = await EmployeeAllowance.findAll(
        {
          where: { allowanceId: allowance.id },
        }
      );

      if (allowancesAssociatedWithEmployees.length > 0) {
        response.status(409).json({
          message:
            "Existen servicios asociados al router, modifiquelos primero!",
        });
        return;
      }

      allowance.destroy({ transaction: t });

      response.status(200).json({ data: allowance.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export default {
  createAllowance,
  getAllAllowances,
  getAllowanceById,
  updateAllowance,
  deleteAllowance,
};

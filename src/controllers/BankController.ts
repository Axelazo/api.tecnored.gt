import { Response } from "express";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import Bank from "../models/Bank";
import Account from "../models/Account";

export const createBank = async (request: AuthRequest, response: Response) => {
  const { name } = request.body;
  try {
    await sequelize.transaction(async (t: Transaction) => {
      const existingBank = await Bank.findOne({ where: { name } });

      if (existingBank) {
        const message = `El banco ya existe!`;
        response.status(409).json({ message });
        return;
      }

      if (!name) {
        const message = `El nombre del banco es requerido!`;
        response.status(422).json({ message });
        return;
      }

      const newBank = await Bank.create({ name }, { transaction: t });

      if (newBank) {
        response.status(200).json({ id: newBank.id });
        return;
      }
    });
  } catch (error) {
    response.status(500).json(error);
    return;
  }
};

export const getAllBanks = async (request: AuthRequest, response: Response) => {
  try {
    const banks = await Bank.findAll();

    response.status(200).json({ data: banks });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const updateBank = async (request: AuthRequest, response: Response) => {
  const { id } = request.params;
  const { name } = request.body;

  try {
    await sequelize.transaction(async (t: Transaction) => {
      const bank = await Bank.findByPk(id); // Find the bank by its id

      if (!bank) {
        const message = "El banco solicitado no ha sido encontrado!";
        return response.status(404).json({ message });
      }

      if (bank.name === name) {
        const message = "El nombre del banco ya existe!";

        return response.status(409).json({ message });
      }

      await bank.update({ name }, { transaction: t });

      response.status(200).json({ id: bank.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const deleteBank = async (request: AuthRequest, response: Response) => {
  const { id } = request.params;

  try {
    await sequelize.transaction(async (t: Transaction) => {
      const bank = await Bank.findByPk(id, {
        include: [{ model: Account, as: "accounts" }],
      });

      if (!bank) {
        const message = `El banco solicitado no ha sido encontrado!`;
        response.status(404).json({ message });
        return;
      }

      if (bank.accounts && bank.accounts.length > 0) {
        await Account.update(
          { bankId: bank.id },
          { where: { bankId: bank.id }, transaction: t }
        );
      }

      await bank.destroy({ transaction: t }); // Delete the bank

      response
        .status(200)
        .json({ message: "El banco ha sido borrado satisfactoriamente!" });
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

export const getAllAccountsFromBank = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;
  try {
    const accounts = await Account.findAll({
      where: {
        bankId: id,
      },
    });

    response.status(200).json({ data: accounts });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export default {
  createBank,
  getAllBanks,
  updateBank,
  deleteBank,
  getAllAccountsFromBank,
};

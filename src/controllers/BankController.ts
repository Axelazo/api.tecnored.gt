import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import Bank from "../models/Bank";
import Account from "../models/Account";

export const getAllBanks = async (request: AuthRequest, response: Response) => {
  try {
    const banks = await Bank.findAll();

    response.status(200).json({ data: banks });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
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
  getAllBanks,
  getAllAccountsFromBank,
};

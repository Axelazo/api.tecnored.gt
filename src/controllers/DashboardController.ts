import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import Client from "../models/Client";
import { Op } from "sequelize";

export const getDashboardData = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    //Count all clients in DB
    const totalClients = await Client.count();

    const today = new Date(); // get today's date
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // set start of month to 1st day of current month
    const endOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
      23,
      59,
      59
    ); // set end of month to last day of current month, last second of day

    //Count all clients in DB created this month
    const totalOfNewClientsCreatedThisMonth = await Client.count({
      where: {
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
      0,
      0,
      0,
      -1
    );

    //Count all clients in DB created today
    const totalOfNewClientsCreatedToday = await Client.count({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
    });

    response.status(200).json({
      clients: {
        totalClients,
        totalOfNewClientsCreatedThisMonth,
        totalOfNewClientsCreatedToday,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export default {
  getDashboardData,
};

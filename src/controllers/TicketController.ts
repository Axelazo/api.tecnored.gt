import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import { Transaction } from "sequelize";
import { sequelize } from "../models";
import Ticket from "../models/Ticket";
import TicketStatuses from "../models/TicketStatuses";
import TicketAssignees from "../models/TicketAssignees";
import Employee from "../models/Employee";
import User from "../models/User";

// Used for populating Tickets -> Admin
export const getAllTickets = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: TicketStatuses,
          as: "statuses",
        },
      ],
    });

    const ticketsAmount = tickets.length;

    if (ticketsAmount > 0) {
      response.status(200).json({ data: tickets });
    } else {
      response.status(204).json({ message: "No se ha encontrado ningun plan" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

// Used for populating Tickets -> Employee
export const getAllTicketsForEmployee = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { id } = request.params;

    const tickets = await TicketAssignees.findAll({
      where: { assigneeId: id },
      include: [
        {
          model: Ticket,
          as: "ticket",
          include: [
            {
              model: TicketStatuses,
              as: "status",
              order: [["createdAt", "DESC"]],
              limit: 1,
            },
          ],
        },
        { model: Employee },
        { model: User },
      ],
    });

    const ticketsAmount = tickets.length;

    if (ticketsAmount > 0) {
      response.status(200).json({ data: tickets });
    } else {
      response.status(204).json({ message: "No se ha encontrado ningun plan" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export default { getAllTickets };

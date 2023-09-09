import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import {
  Person,
  Ticket,
  TicketStatus,
  TicketStatuses,
} from "../models/Relationships";
import TicketAssignees from "../models/TicketAssignees";
import Employee from "../models/Employee";
import User from "../models/User";
import { sequelize } from "../models";
import { Sequelize, Transaction } from "sequelize";
import Service from "../models/Service";

export const createTicketForService = async (
  request: AuthRequest,
  response: Response
) => {
  const {
    serviceId,
    clientId,
    employeeId,
    estimatedFinish,
    estimatedStart,
    priority,
    reasonId,
    customReason,
  } = request.body;
  try {
    if (!serviceId) {
      return response.status(409).json({
        message: "El servicio es requerido!",
      });
    }

    if (!clientId) {
      return response.status(409).json({
        message: "El cliente es requerido!",
      });
    }

    if (!employeeId) {
      return response.status(409).json({
        message: "El técnico asignado es requerido!",
      });
    }

    if (!estimatedFinish) {
      return response.status(409).json({
        message: "La fecha estimada de finalización es requerida!",
      });
    }

    if (!estimatedStart) {
      return response.status(409).json({
        message: "La fecha estimada de inicialización es requerida!",
      });
    }

    if (!estimatedStart) {
      return response.status(409).json({
        message: "La fecha estimada de inicialización es requerida!",
      });
    }

    if (!priority) {
      return response.status(409).json({
        message: "La prioridad del ticket es requerida!",
      });
    }

    if (!reasonId) {
      return response.status(409).json({
        message: "El asunto / razón es requerida!",
      });
    }

    if (reasonId === 999 && !customReason) {
      return response.status(409).json({
        message: "El asunto / razón personalizada es requerida!",
      });
    }

    await sequelize.transaction(async (t: Transaction) => {
      // Find existing everything
      const existingService = await Service.findByPk(serviceId);

      if (!existingService) {
        throw Error("El servicio indicado no existe");
      }

      const existingEmployee = await Employee.findByPk(serviceId);

      if (!existingEmployee) {
        throw Error("El empleado indicado no existe");
      }

      const newTicket = await Ticket.create(
        {
          title: "test",
          description: "test",
          serviceId: serviceId,
          creatorId: 1,
        },
        { transaction: t }
      );

      const newTicketAssignee = await TicketAssignees.create(
        {
          ticketId: newTicket.id,
          assigneeId: employeeId,
          start: new Date(),
        },
        { transaction: t }
      );

      const newTicketStatus = await TicketStatuses.create(
        {
          ticketId: newTicket.id,
          statusId: 2, // Abierto
        },
        { transaction: t }
      );

      response.status(200).json({ id: newTicket.id });
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json(error);
    }
  }
};

// Used for populating Tickets -> Admin
export const getAllTickets = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        {
          model: TicketStatus,
          as: "statuses",
          through: {
            as: "ticketsStatuses",
          },
        },
        {
          model: Employee,
          as: "assignees",
          include: [{ model: Person, as: "person" }],
        },
      ],
      order: [
        [Sequelize.literal("`statuses->ticketsStatuses`.`createdAt`"), "DESC"],
      ],
    });

    const ticketsAmount = tickets.length;

    if (ticketsAmount > 0) {
      response.status(200).json({ data: tickets });
    } else {
      response
        .status(204)
        .json({ message: "No se ha encontrado ningun ticket" });
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

export const updateTicketStatus = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;
  const { statusId } = request.body;
  const ticketId = parseInt(id);

  if (!id) {
    return response.status(409).json({
      message: "El estado del ticket es requerido!",
    });
  }

  try {
    await sequelize.transaction(async (t: Transaction) => {
      // Find existing everything
      const existingTicket = await Ticket.findByPk(ticketId);

      if (!existingTicket) {
        throw Error("El ticket indicado no existe");
      }

      const existingTicketStatus = await TicketStatus.findByPk(statusId);

      if (!existingTicketStatus) {
        throw Error("El estado de ticket indicado no existe");
      }

      const newStatus = await TicketStatuses.create(
        {
          ticketId,
          statusId,
        },
        { transaction: t }
      );

      response.status(200).json({ id: ticketId });
    });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export default {
  getAllTickets,
  getAllTicketsForEmployee,
  createTicketForService,
  updateTicketStatus,
};

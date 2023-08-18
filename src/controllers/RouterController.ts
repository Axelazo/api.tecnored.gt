import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import Establishment from "../models/Establishment";
import Router from "../models/Router";
import Service from "../models/Service";
import { isValidIPv4 } from "../utils/ip";

export const createRouter = async (
  request: AuthRequest,
  response: Response
) => {
  const { name, ipAddress, establishmentId } = request.body;
  try {
    sequelize.transaction(async (t: Transaction) => {
      const establishment = await Establishment.findByPk(establishmentId);

      if (!name) {
        const message = `El nombre del router es requerido!`;
        response.status(422).json({ message });
        return;
      }

      if (!ipAddress) {
        const message = `La dirección IP del router es requerido!`;
        response.status(422).json({ message });
        return;
      }

      if (!isValidIPv4(ipAddress)) {
        const message = `La dirección IP no es válida!`;
        response.status(422).json({ message });
        return;
      }

      if (!establishmentId) {
        const message = `El establecimiento es requerido!`;
        response.status(422).json({ message });
        return;
      }

      if (!establishment) {
        const message = `No se han encontrado el establecimiento`;
        response.status(404).json({ message });
        return;
      }

      const router = await Router.create(
        {
          name,
          ipAddress,
          establishmentId,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: router.id,
      });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getAllRouters = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const routers = await Router.findAll({
      include: { model: Establishment, as: "establishment" },
    });

    const routersAmount = routers.length;

    if (routersAmount > 0) {
      response.status(200).json({ data: routers });
    } else {
      response
        .status(204)
        .json({ message: "No se ha encontrado ningun router!" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getRouterById = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    const router = await Router.findByPk(id);

    if (!router) {
      response.status(404).json({ message: "No se ha encontrado el router" });
      return;
    }
    response.status(200).json({ data: router });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const updateRouter = async (
  request: AuthRequest,
  response: Response
) => {
  const { name, establishmentId } = request.body;
  const { id } = request.params;

  try {
    sequelize.transaction(async (t: Transaction) => {
      const router = await Router.findByPk(id);

      if (!router) {
        response.status(404).json({ message: "No se ha encontrado el router" });
        return;
      }

      router.name = name;
      router.establishmentId = establishmentId;

      router.save({ transaction: t, hooks: true });

      response.status(200).json({ data: router.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const deleteRouter = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    sequelize.transaction(async (t: Transaction) => {
      const router = await Router.findByPk(id);

      if (!router) {
        response.status(404).json({ message: "No se ha encontrado el router" });
        return;
      }

      const servicesAssociatedToRouter = await Service.findAll({
        where: { routerId: id },
      });

      if (servicesAssociatedToRouter) {
        response.status(409).json({
          message:
            "Existen servicios asociados al router, modifiquelos primero!",
        });
        return;
      }

      router.destroy({ transaction: t });

      response.status(200).json({ data: router.id });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export default {
  createRouter,
  getAllRouters,
  getRouterById,
  updateRouter,
  deleteRouter,
};

import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import Establishment from "../models/Establishment";
import Area from "../models/Area";
import Position from "../models/Position";
import { sequelize } from "../models";
import { Transaction, Op } from "sequelize";
import EstablishmentArea from "../models/EstablishmentArea";

export const getAllEstablishments = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const establishments = await Establishment.findAll();

    response.status(200).json({ data: establishments });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getAllAreas = async (request: AuthRequest, response: Response) => {
  try {
    const areas = await Area.findAll();

    if (areas.length > 0) {
      response.status(200).json({ data: areas });
    } else {
      response.status(204).json();
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getAllPositions = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const positions = await Position.findAll();

    if (positions.length > 0) {
      response.status(200).json({ data: positions });
    } else {
      response.status(204).json();
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const createEstablishmentAreaRelationship = async (
  request: AuthRequest,
  response: Response
) => {
  const { establishmentId, areaId } = request.body;

  try {
    sequelize.transaction(async (t: Transaction) => {
      if (!establishmentId) {
        return response.status(422).json({
          message: "El establecimiento es requerido!",
        });
      }

      if (!areaId) {
        return response.status(422).json({
          message: "El area es requerida!",
        });
      }

      const existingEstablishment = await Establishment.findByPk(
        establishmentId
      );

      if (!existingEstablishment) {
        return response.status(404).json({
          message: "No se ha encontrado el establecimiento!",
        });
      }

      const existingEstablishmentWithSameValues =
        await EstablishmentArea.findOne({
          where: {
            establishmentId: establishmentId,
            areaId: areaId,
          },
        });

      if (existingEstablishmentWithSameValues) {
        return response.status(409).json({
          message: "Esa relacion entre establecimiento y area ya existe!",
        });
      }

      const existingArea = Area.findByPk(areaId);

      if (!existingArea) {
        return response.status(422).json({
          message: "No se ha encontrado el area!",
        });
      }

      const newEstablishmentArea = await EstablishmentArea.create(
        {
          establishmentId,
          areaId,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: newEstablishmentArea.id,
      });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getAllAreasFromEstablishment = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    const areas = await Area.findAll({
      include: [
        {
          model: Establishment, // This should be the model name, not the alias "establishments"
          as: "establishments",
          where: {
            id, // Replace with the actual establishment ID
          },
          through: { attributes: [] }, // Exclude junction table attributes
          attributes: [], // Exclude establishment attributes, show only areas
        },
      ],
    });

    if (areas.length > 0) {
      response.status(200).json({ data: areas });
    } else {
      response.status(204).json();
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const deleteEstablishmentAreaRelationship = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    sequelize.transaction(async (t: Transaction) => {
      const existingEstablishmentArea = await EstablishmentArea.findByPk(id);

      if (!existingEstablishmentArea) {
        return response.status(404).json({
          message:
            "La relacion entre el establecimiento y el area indicada no existe!",
        });
      }

      await existingEstablishmentArea.destroy({ transaction: t });

      response.status(200).json({
        message:
          "Relacion entre establecimiento y area eliminado exitosamente!",
      });
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

export default {
  getAllEstablishments,
  getAllAreasFromEstablishment,
  getAllAreas,
  getAllPositions,
  createEstablishmentAreaRelationship,
  deleteEstablishmentAreaRelationship,
};

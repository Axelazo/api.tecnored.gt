import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import Establishment from "../models/Establishment";
import Area from "../models/Area";
import Position from "../models/Position";

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

export const getAllAreasFromEstablishment = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    const areas = await Area.findAll({
      where: {
        establishmentId: id,
      },
      attributes: { exclude: ["areaId"] },
    });

    response.status(200).json({ data: areas });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getAllPositionsFromArea = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    const positions = await Position.findAll({
      where: {
        areaId: id,
      },
    });

    response.status(200).json({ data: positions });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export default {
  getAllEstablishments,
  getAllAreasFromEstablishment,
  getAllPositionsFromArea,
};

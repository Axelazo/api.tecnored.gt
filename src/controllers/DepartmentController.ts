import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import Department from "../models/Department";
import Municipality from "../models/Municipality";

export const getAllDepartments = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const departments = await Department.findAll();

    response.status(200).json({ data: departments });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getAllMunicipalitiesFromDepartment = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;
  try {
    const municipalities = await Municipality.findAll({
      where: {
        departmentId: id,
      },
    });

    response.status(200).json({ data: municipalities });
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export default {
  getAllDepartments,
  getAllMunicipalitiesFromDepartment,
};

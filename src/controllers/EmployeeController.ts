import { sequelize } from "../models";
import { Response } from "express";
import {
  PhoneInterface,
  AuthRequest,
  PersonAPI,
  AddressAPI,
  PhoneAPI,
  DpiAPI,
} from "../ts/interfaces/app-interfaces";
import Employee from "../models/Employee";
import Person from "../models/Person";
import Address from "../models/Address";
import Phone from "../models/Phone";
import Dpi from "../models/Dpi";
import Department from "../models/Department";
import Municipality from "../models/Municipality";

export const getAllEmployees = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const employees = await Employee.findAll({
      include: [
        {
          model: Person,
          as: "person",
          include: [
            {
              model: Address,
              as: "address",
            },
            { model: Phone, as: "phones" },
          ],
        },
      ],
      attributes: { exclude: ["personId"] }, // Exclude the personId field
    });

    const employeesAmount = employees.length;

    if (employeesAmount > 0) {
      response.status(200).json({ data: employees });
    } else {
      response
        .status(204)
        .json({ message: "No se ha encontrado ningun empleado" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getEmployeeById = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { id } = request.params;
    const employee = await Employee.findOne({
      where: { id },
      include: [
        {
          model: Person,
          as: "person",
          include: [
            {
              model: Dpi,
              as: "dpi",
            },
            {
              model: Address,
              as: "address",
              include: [
                {
                  model: Department,
                  as: "department",
                },
                {
                  model: Municipality,
                  as: "municipality",
                },
              ],
            },
            {
              model: Phone,
              as: "phones",
            },
          ],
        },
      ],
      attributes: { exclude: ["personId"] },
    });

    if (employee) {
      response.status(200).json({ data: employee });
    } else {
      response.status(404).json({ message: "El empleado no se ha encontrado" });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "Hubo un problema el procesar la petición" });
  }
};

export default {
  getAllEmployees,
  getEmployeeById,
};

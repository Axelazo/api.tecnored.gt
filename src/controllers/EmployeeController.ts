import { sequelize } from "../models";
import { Op, Transaction } from "sequelize";
import { Response } from "express";
import {
  PhoneInterface,
  AuthRequest,
  AddressAPI,
  PhoneAPI,
  DpiAPI,
  EmployeeAPI,
} from "../ts/interfaces/app-interfaces";
import Employee from "../models/Employee";
import Person from "../models/Person";
import Address from "../models/Address";
import Phone from "../models/Phone";
import Dpi from "../models/Dpi";
import Department from "../models/Department";
import Municipality from "../models/Municipality";
import { generateUniqueNumber } from "../utils/generation";
import Salary from "../models/Salary";
import Account from "../models/Account";
import Establishment from "../models/Establishment";
import Position from "../models/Position";
import Area from "../models/Area";

// TODO: Implement validation, delete sensitive fields,
export const createEmployee = async (
  request: AuthRequest,
  response: Response
) => {
  const {
    employee,
    address,
    dpi,
    phones,
  }: {
    employee: EmployeeAPI;
    address: AddressAPI;
    dpi: DpiAPI;
    phones: PhoneAPI[];
  } = request.body;

  const url = `${request.protocol}://${request.get("host")}`;

  try {
    sequelize.transaction(async (t: Transaction) => {
      //Validations for required fields
      if (!employee.firstNames) {
        return response.status(400).json({
          message: "Los nombres son requeridos!",
        });
      }

      if (!employee.lastNames) {
        return response.status(400).json({
          message: "Los apellidos son requeridos!",
        });
      }

      if (!phones) {
        return response.status(400).json({
          message: "Los numeros de teléfono son requeridos!",
        });
      }

      if (!employee.nitNumber) {
        return response.status(400).json({
          message: "El nit es requerido!",
          data: request.body,
        });
      }

      if (!dpi.number) {
        return response.status(400).json({
          message: "El DPI es requerido!",
          data: request.body,
        });
      }

      const phoneInstances: PhoneInterface[] = phones.map((phone) => ({
        type: phone.type,
        number: phone.number,
      }));

      //Creates the person
      const newPerson = await Person.create(
        {
          firstNames: employee.firstNames,
          lastNames: employee.lastNames,
          birthday: employee.birthday,
          email: employee.email,
          nitNumber: employee.nitNumber,
        },
        { transaction: t }
      );

      //Create the phones of that person
      phoneInstances.forEach((phone) => {
        phone.personId = newPerson.id;
      });

      const newPhones = await Phone.bulkCreate(phoneInstances, {
        transaction: t,
      });

      let dpiFrontUrl = null;
      let dpiBackUrl = null;
      let profilePicture = null;

      if (request.files) {
        const filesArray = Array.isArray(request.files)
          ? request.files
          : Object.values(request.files);

        for (const file of filesArray) {
          if (Array.isArray(file)) {
            for (const f of file) {
              if (f.fieldname === "dpiFront") {
                dpiFrontUrl = `${url}/public/${f.filename}`;
              } else if (f.fieldname === "dpiBack") {
                dpiBackUrl = `${url}/public/${f.filename}`;
              } else if (f.fieldname === "profilePicture") {
                profilePicture = `${url}/public/${f.filename}`;
              }
            }
          } else {
            if (file.fieldname === "dpiFront") {
              dpiFrontUrl = `${url}/public/${file.filename}`;
            } else if (file.fieldname === "dpiBack") {
              dpiBackUrl = `${url}/public/${file.filename}`;
            }
          }
        }
      }

      if (!dpiFrontUrl || !dpiBackUrl) {
        return response.status(400).json({
          message: "El dpi frontal y trasero son requeridos!",
        });
      }

      if (!profilePicture) {
        return response.status(400).json({
          message: "La foto de perfil es requerida!",
        });
      }

      //Creates the dpi
      const newDpi = await Dpi.create(
        {
          number: dpi.number,
          dpiFrontUrl: dpiFrontUrl,
          dpiBackUrl: dpiBackUrl,
          personId: newPerson.id,
        },
        {
          transaction: t,
        }
      );

      //Creates the address
      const newAddress = await Address.create(
        {
          type: address.type,
          street: address.street,
          locality: address.locality,
          municipalityId: address.municipality,
          departmentId: address.department,
          personId: newPerson.id,
          zipCode: address.zipCode,
        },
        {
          transaction: t,
        }
      );

      //Creates the unique clientNumber
      const employeeNumber = await generateUniqueNumber(
        8,
        "employeeNumber",
        Employee
      );

      if (!employeeNumber) {
        return response
          .status(500)
          .json({ message: "Hubo un error al generar el cliente" });
      }

      //Finaly we create the employee when the whole data of the person is complete!
      const newEmployee = await Employee.create(
        {
          personId: newPerson.id,
          employeeNumber,
          positionId: employee.position,
          profileUrl: profilePicture,
        },
        { transaction: t }
      );

      const newSalary = await Salary.create(
        {
          employeeId: newEmployee.id,
          amount: employee.salary,
          start: new Date(),
        },
        { transaction: t }
      );

      const newAccount = await Account.create(
        {
          employeeId: newEmployee.id,
          number: employee.accountNumber,
          bankId: employee.bank,
        },
        {
          transaction: t,
        }
      );

      response.status(200).json({
        id: newEmployee.dataValues.id,
      });
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

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
        {
          model: Position,
          as: "position",
          include: [
            {
              model: Area,
              as: "area",
              include: [{ model: Establishment, as: "establishment" }],
            },
          ],
        },
        {
          model: Salary,
          as: "salaries",
        },
      ],
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
  createEmployee,
};

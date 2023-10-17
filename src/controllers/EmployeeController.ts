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
  IProcessedPayroll,
  ProcessedPayrollEmployeeEntry,
} from "../ts/interfaces/app-interfaces";
import Employee from "../models/Employee";
import Person from "../models/Person";
import Address from "../models/Address";
import Phone from "../models/Phone";
import Dpi from "../models/Dpi";
import Department from "../models/Department";
import Municipality from "../models/Municipality";
import {
  capitalizeFirstLetter,
  generateCorporateEmail,
  generateUniqueNumber,
} from "../utils/generation";
import Salary from "../models/Salary";
import Account from "../models/Account";
import Establishment from "../models/Establishment";
import Position from "../models/Position";
import Area from "../models/Area";
import Bank from "../models/Bank";
import EmployeePositionMapping from "../models/EmployeePositionMapping";
import User from "../models/User";
import UserRole from "../models/UserRole";
import Payroll from "../models/Payroll";
import PayrollItem from "../models/PayrollItem";
import { differenceInCalendarDays, format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import EmployeeAllowance from "../models/EmployeeAllowance";
import EmployeeDeduction from "../models/EmployeeDeduction";
import ProcessedPayroll from "../models/ProcessedPayroll";
import { mergeProcessedPayrolls } from "../utils/misc";

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
        return response.status(422).json({
          message: "Los nombres son requeridos!",
        });
      }

      if (!employee.lastNames) {
        return response.status(422).json({
          message: "Los apellidos son requeridos!",
        });
      }

      if (!phones) {
        return response.status(422).json({
          message: "Los numeros de teléfono son requeridos!",
        });
      }

      if (!employee.nitNumber) {
        return response.status(422).json({
          message: "El nit es requerido!",
        });
      }

      if (!dpi.number) {
        return response.status(422).json({
          message: "El DPI es requerido!",
        });
      }

      if (!employee.establishment) {
        return response.status(422).json({
          message: "El establecimiento es requerido!",
        });
      }

      if (!employee.position) {
        return response.status(422).json({
          message: "La posición es requerida!",
        });
      }

      if (!employee.area) {
        return response.status(422).json({
          message: "El área es requerido!",
        });
      }

      const phoneInstances: PhoneInterface[] = phones.map((phone) => ({
        type: phone.type,
        number: phone.number,
      }));

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

      // Check if DPI is unique
      const existingDpi = await Dpi.findOne({
        where: {
          number: dpi.number,
        },
      });

      if (existingDpi) {
        return response.status(409).json({
          message: "El DPI ya está en uso!",
        });
      }

      // Check if NIT is unique
      const existingNit = await Person.findOne({
        where: {
          nitNumber: employee.nitNumber,
        },
      });

      if (existingNit) {
        return response.status(409).json({
          message: "El NIT ya está en uso!",
        });
      }

      if (!dpiFrontUrl || !dpiBackUrl) {
        return response.status(422).json({
          message: "El dpi frontal y trasero son requeridos!",
        });
      }

      if (!profilePicture) {
        return response.status(422).json({
          message: "La foto de perfil es requerida!",
        });
      }

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

      // TODO Create the Employee Establishment -> Area -> Position mapping entry
      const newEmployeePositionMapping = await EmployeePositionMapping.create(
        {
          employeeId: newEmployee.id,
          establishmentId: employee.establishment,
          areaId: employee.area,
          positionId: employee.position,
        },
        { transaction: t }
      );

      const emailAccountName = generateCorporateEmail(
        employee.firstNames,
        employee.lastNames
      );

      const newEmployeeUser = await User.create(
        {
          firstNames: employee.firstNames,
          lastNames: employee.lastNames,
          password: "Axelazo123!",
          email: `${emailAccountName}@tecnored.gt`,
          employeeId: newEmployee.id,
        },
        { transaction: t }
      );

      const newUserRoles = await UserRole.create(
        {
          userId: newEmployeeUser.id,
          roleId: 4, //hardcoded 4 value
        },
        { transaction: t }
      );

      // Payroll related => Grabs the most recent Payroll entry on the system, and generates a PayrollItem with referencing the Payroll "id" field and the employee

      const mostRecentPayroll = await Payroll.findOne({
        order: [["createdAt", "DESC"]],
      });

      if (!mostRecentPayroll) {
        return response.status(404).json({
          message: "No se ha encontrado la planilla más reciente",
        });
      }

      // Grabs the current month
      const month = capitalizeFirstLetter(
        format(mostRecentPayroll.from, "MMMM", { locale: es })
      );

      const newEmployeePayrollItem = await PayrollItem.create(
        {
          month,
          payrollId: mostRecentPayroll.id,
          salary: newSalary.amount,
          allowancesAmount: 0,
          deductionsAmount: 0,
          net: newSalary.amount,
          employeeId: newEmployee.id,
        },
        { transaction: t }
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

export const getAllEmployeesWithPosition = async (
  request: AuthRequest,
  response: Response
) => {
  const { positionName } = request.params;

  const likeString = `%${positionName}%`;

  const employees = await Employee.findAll({
    include: [
      { model: Person, as: "person" },
      {
        model: Position,
        where: {
          name: {
            [Op.like]: likeString,
          },
        },
      },
    ],
  });

  if (employees.length > 0) {
    response.status(200).json({ data: employees });
  } else {
    response
      .status(204)
      .json({ message: "No se han encontrado empleados con esa posición" });
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
          model: EmployeePositionMapping,
          as: "employeePositionMapping",
          include: [
            {
              model: Position,
              as: "position",
            },
            {
              model: Area,
              as: "area",
            },
            { model: Establishment, as: "establishment" },
          ],
        },
        {
          model: Salary,
          as: "salaries",
        },
        {
          model: Account,
          as: "account",
          include: [
            {
              model: Bank,
              as: "bank",
            },
          ],
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

export const updateEmployee = async (
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
  const { id } = request.params;

  const url = `${request.protocol}://${request.get("host")}`;

  try {
    sequelize.transaction(async (t: Transaction) => {
      const existingEmployee = await Employee.findByPk(id, {
        include: [
          {
            model: Person,
            as: "person",
          },
        ],
      });

      if (!existingEmployee) {
        return response.status(404).json({
          message: "El empleado indicado no existe!",
        });
      }

      //Validations for required fields
      if (!employee.firstNames) {
        return response.status(422).json({
          message: "Los nombres son requeridos!",
        });
      }

      if (!employee.lastNames) {
        return response.status(422).json({
          message: "Los apellidos son requeridos!",
        });
      }

      if (!phones) {
        return response.status(422).json({
          message: "Los numeros de teléfono son requeridos!",
        });
      }

      if (!employee.nitNumber) {
        return response.status(422).json({
          message: "El nit es requerido!",
          data: request.body,
        });
      }

      if (!dpi.number) {
        return response.status(422).json({
          message: "El DPI es requerido!",
          data: request.body,
        });
      }

      const phoneInstances: PhoneInterface[] = phones.map((phone) => ({
        type: phone.type,
        number: phone.number,
      }));

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
        return response.status(422).json({
          message: "El dpi frontal y trasero son requeridos!",
        });
      }

      if (!profilePicture) {
        return response.status(422).json({
          message: "La foto de perfil es requerida!",
        });
      }

      const person = await existingEmployee.getPerson();

      const existingDpi = await Dpi.findOne({
        where: {
          number: dpi.number,
          personId: {
            [Op.ne]: person.id,
          },
        },
      });

      if (existingDpi) {
        return response.status(409).json({
          message: "El DPI ya está en uso!",
        });
      }

      // Check if NIT is unique
      const existingNit = await Person.findOne({
        where: {
          nitNumber: employee.nitNumber,
          id: {
            [Op.ne]: person.id,
          },
        },
      });

      if (existingNit) {
        return response.status(409).json({
          message: "El NIT ya está en uso!",
        });
      }

      //Updates the Person
      const existingPerson = await Person.findOne({
        where: {
          id: existingEmployee.personId,
        },
      });

      if (!existingPerson) {
        return response.status(404).json({
          message: "No se ha encontrado la persona!",
        });
      }

      const clientDpi = await existingPerson.getDpi();
      clientDpi.number = dpi.number;
      clientDpi.dpiFrontUrl = dpiFrontUrl;
      clientDpi.dpiBackUrl = dpiBackUrl;

      existingPerson.firstNames = employee.firstNames;
      existingPerson.lastNames = employee.lastNames;
      existingPerson.birthday = employee.birthday;
      existingPerson.email = employee.email;
      existingPerson.nitNumber = employee.nitNumber;

      await existingPerson.save({ transaction: t, hooks: true });

      // Update the Phones
      const existingPhones = await Phone.findAll({
        where: { personId: existingEmployee.personId },
        transaction: t,
      });

      const existingPhoneNumbers = existingPhones.map((phone) => phone.number);

      // Find phones to add and update
      const phonesToAdd = phoneInstances.filter(
        (phone) => !existingPhoneNumbers.includes(phone.number)
      );
      const phonesToUpdate = phoneInstances.filter((phone) =>
        existingPhoneNumbers.includes(phone.number)
      );

      // Add new phones
      for (const phone of phonesToAdd) {
        const phoneInstance = await Phone.create(
          {
            ...phone,
            personId: existingEmployee.personId,
          },
          { transaction: t }
        );

        existingPhones.push(phoneInstance);
      }

      // Update existing phones
      for (const phone of phonesToUpdate) {
        const phoneInstance = existingPhones.find(
          (p) => p.number === phone.number
        );

        if (!phoneInstance) {
          continue;
        }

        phoneInstance.type = phone.type;

        await phoneInstance.save({ transaction: t, hooks: true });
      }

      // Update Address
      const existingAddress = await Address.findOne({
        where: {
          personId: existingPerson.id,
        },
      });

      if (!existingAddress) {
        const message = `No se ha encontrado la direccion del cliente`;
        response.status(404).json({ message });
        return;
      }

      existingAddress.type = address.type;
      existingAddress.street = address.street;
      existingAddress.locality = address.locality;
      existingAddress.municipalityId = address.municipality;
      existingAddress.departmentId = address.department;
      existingAddress.zipCode = address.zipCode;

      await existingAddress.save({ transaction: t, hooks: true });

      // Update Employee
      existingEmployee.profileUrl = profilePicture;

      await existingEmployee.save({ transaction: t, hooks: true });

      // TODO Update the mapping table if changed!

      response.status(200).json({
        id: existingEmployee.id,
        message: "Cliente actualizado exitosamente!",
      });
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

export const deleteEmployee = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { id } = request.params;

    sequelize.transaction(async (t: Transaction) => {
      const existingEmployee = await Employee.findByPk(id, {
        include: [
          {
            model: Person,
            as: "person",
          },
        ],
        transaction: t,
      });

      if (!existingEmployee) {
        return response.status(404).json({
          message: "El empleado indicado no existe!",
        });
      }

      // Delete Phones
      await Phone.destroy({
        where: { personId: existingEmployee.personId },
        transaction: t,
      });

      // Delete Address
      await Address.destroy({
        where: { personId: existingEmployee.personId },
        transaction: t,
      });

      // Delete DPI
      await Dpi.destroy({
        where: { personId: existingEmployee.personId },
        transaction: t,
      });

      // Delete Salary
      await Salary.destroy({
        where: { employeeId: existingEmployee.id },
        transaction: t,
      });

      // Delete Account
      await Account.destroy({
        where: { employeeId: existingEmployee.id },
        transaction: t,
      });

      await EmployeePositionMapping.destroy({
        where: {
          employeeId: existingEmployee.id,
        },
        transaction: t,
      });

      // Delete user and roles related to this Employee
      const existingEmployeeUser = await User.findOne({
        where: {
          employeeId: existingEmployee.id,
        },
        transaction: t,
      });

      if (!existingEmployeeUser) {
        return response.status(200).json({
          message: "El usuario del empleado no existe!",
        });
      }

      await UserRole.destroy({
        where: {
          userId: existingEmployeeUser.id,
        },
        transaction: t,
      });

      await existingEmployeeUser.destroy({ transaction: t });

      // Before deleting everything related to the Payroll, we need to do some things to reflect the Employee in the Payroll even if his deleted (fired)
      // We need to:
      // Retrieve the most recent ProcessedPayroll entry
      // Calculate the payment that needs to be done to the Employee at the end of the month
      // Insert the data of the ProcessedPayroll with, net, sum, allowances
      const currentDate = new Date();
      const existingPayroll = await Payroll.findOne({
        order: [["createdAt", "DESC"]],
        transaction: t,
      });

      // If for some odd FUCKING reason the  Processed Payroll doesn't exist, we return an error
      if (!existingPayroll) {
        return response
          .status(404)
          .json({ message: "La Planilla no ha sido encontrada" });
      }

      const existingProcessedPayroll = await ProcessedPayroll.findOne({
        order: [["createdAt", "DESC"]],
        transaction: t,
      });

      // If for some odd FUCKING reason the  Processed Payroll doesn't exist, we return an error
      if (!existingProcessedPayroll) {
        return response
          .status(404)
          .json({ message: "La Planilla Procesada no ha sido encontrada" });
      }

      // If the payroll has been "processed" in this context, downloaded, it will have data, so we need to retrieve the existing data, empty or not
      let existingPayrollData: IProcessedPayroll = {
        payrollId: 0,
        net: 0,
        month: "",
        period: "",
        sum: 0,
        allowances: 0,
        deductions: 0,
        employees: [],
      };

      const newPayrollData: IProcessedPayroll = {
        payrollId: 0,
        net: 0,
        month: "",
        period: "",
        sum: 0,
        allowances: 0,
        deductions: 0,
        employees: [],
      };

      if (existingProcessedPayroll) {
        // payroll exists, data needs to be retrieved and added
        existingPayrollData = JSON.parse(existingProcessedPayroll.data);
      }

      let net = 0;
      let allowances = 0;
      let deductions = 0;

      const month = capitalizeFirstLetter(
        format(existingPayroll.from, "MMMM", { locale: es })
      );
      const period = `${format(existingPayroll.from, "dd/MM/yyyy")} al ${format(
        existingPayroll.to,
        "dd/MM/yyyy"
      )}`;

      const existingPayrollItem = await PayrollItem.findOne({
        where: {
          payrollId: existingPayroll.id,
        },
        include: [
          {
            model: Employee,
            as: "employee",
            include: [
              {
                model: Salary,
                as: "salaries",
              },
            ],
          },
        ],
        transaction: t,
      });

      console.log(existingPayrollItem?.employeeId);

      const salaries = await Salary.findAll({
        where: {
          employeeId: existingPayrollItem?.employeeId,
        },
      });

      // For some ODD FUCKING reason Payroll Item doesn't exist
      if (!existingPayrollItem) {
        return response
          .status(404)
          .json({ message: "La Item de la Planilla no ha sido encontrado" });
      }

      net += existingPayrollItem.net;

      existingPayrollItem.allowances?.map((employeeAllowance) => {
        allowances += employeeAllowance.amount;
      });

      existingPayrollItem.deductions?.map((employeeDeduction) => {
        deductions += employeeDeduction.amount;
      });

      // Logic to calculate how much to pay to that fuck
      let salary = 0;

      const monthlySalary = salaries[0].amount;

      console.log(monthlySalary);

      const dailySalary = monthlySalary / 30;
      const daysFromStartOfMonth = Math.abs(
        differenceInCalendarDays(existingPayrollItem.createdAt, currentDate)
      );
      salary = dailySalary * daysFromStartOfMonth;

      const employeePayrollEntry: ProcessedPayrollEmployeeEntry = {
        id: existingEmployee.id,
        firstNames: existingEmployee.person?.firstNames,
        lastNames: existingEmployee.person?.lastNames,
        salary: salary,
        allowances,
        deductions,
        from: format(startOfMonth(currentDate), "dd-MM-yyyy"),
        to: format(currentDate, "dd-MM-yyyy"),
        deleted: true,
      };

      newPayrollData.month = month;
      newPayrollData.period = period;
      newPayrollData.employees?.push(employeePayrollEntry);

      const data = mergeProcessedPayrolls(newPayrollData, existingPayrollData);

      // If no existing processed payroll, create it
      if (!existingProcessedPayroll) {
        const newProcessedPayroll = await ProcessedPayroll.create({
          payrollId: 1,
          data: JSON.stringify(data),
        });
      } else {
        // Merge existing records
        existingProcessedPayroll.data = JSON.stringify(data);
        existingProcessedPayroll.save({
          transaction: t,
        });
      }

      // Delete payroll related to this Employee
      const existingPayrollItems = await PayrollItem.findAll({
        where: {
          employeeId: existingEmployee.id,
        },
        transaction: t,
      });

      for (const existingPayrollItem of existingPayrollItems) {
        await EmployeeAllowance.destroy({
          where: {
            payrollItemId: existingPayrollItem.id,
          },
          transaction: t,
        });

        await EmployeeDeduction.destroy({
          where: {
            payrollItemId: existingPayrollItem.id,
          },
          transaction: t,
        });
      }

      await PayrollItem.destroy({
        where: {
          employeeId: existingEmployee.id,
        },
        transaction: t,
      });

      // Delete Employee
      await existingEmployee.destroy({ transaction: t });

      // Delete Person
      await Person.destroy({
        where: { id: existingEmployee.personId },
        transaction: t,
      });

      response.status(200).json({
        message: "Empleado eliminado exitosamente!",
      });
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

export default {
  createEmployee,
  getAllEmployees,
  getAllEmployeesWithPosition,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

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
import { Op, Transaction } from "sequelize";
import Dpi from "../models/Dpi";
import Person from "../models/Person";
import Address from "../models/Address";
import Client from "../models/Client";
import Phone from "../models/Phone";
import Department from "../models/Department";
import Municipality from "../models/Municipality";
import { isAfter } from "date-fns";
import { generateUniqueNumber } from "../utils/generation";

// TODO: Implement validation, delete sensitive fields,
export const createClient = async (
  request: AuthRequest,
  response: Response
) => {
  const {
    person,
    address,
    dpi,
    phones,
  }: {
    person: PersonAPI;
    address: AddressAPI;
    dpi: DpiAPI;
    phones: PhoneAPI[];
  } = request.body;

  const url = `${request.protocol}://${request.get("host")}`;

  try {
    sequelize.transaction(async (t: Transaction) => {
      //Validations for required fields
      if (!person.firstNames) {
        return response.status(422).json({
          message: "Los nombres son requeridos!",
        });
      }

      if (!person.lastNames) {
        return response.status(422).json({
          message: "Los apellidos son requeridos!",
        });
      }

      if (!phones) {
        return response.status(422).json({
          message: "Los numeros de teléfono son requeridos!",
        });
      }

      if (!dpi.number) {
        return response.status(422).json({
          message: "El DPI es requerido!",
        });
      }

      const phoneInstances: PhoneInterface[] = phones.map((phone) => ({
        type: phone.type,
        number: phone.number,
      }));

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

      const existingNit = await Person.findOne({
        where: {
          nitNumber: person.nitNumber,
        },
      });

      if (existingNit) {
        return response.status(409).json({
          message: "El NIT ya está en uso!",
        });
      }

      //Creates the person
      const newPerson = await Person.create(
        {
          firstNames: person.firstNames,
          lastNames: person.lastNames,
          birthday: person.birthday,
          email: person.email,
          nitNumber: person.nitNumber,
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
      const clientNumber = await generateUniqueNumber(
        8,
        "clientNumber",
        Client
      );

      if (clientNumber) {
        //Finaly we create the client when the whole data is complete!
        const newClient = await Client.create(
          { personId: newPerson.id, clientNumber },
          { transaction: t }
        );

        response.status(200).json({
          id: newClient.dataValues.id,
        });
      } else {
        response
          .status(500)
          .json({ message: "Hubo un error al generar el cliente" });
      }
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

export const getAllClients = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const clients = await Client.findAll({
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

    const clientsAmount = clients.length;

    if (clientsAmount > 0) {
      response.status(200).json({ data: clients });
    } else {
      response
        .status(204)
        .json({ message: "No se ha encontrado ningun cliente" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getClientById = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { id } = request.params;
    const client = await Client.findOne({
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

    if (client) {
      response.status(200).json({ data: client });
    } else {
      response.status(404).json({ message: "El cliente no se ha encontrado" });
    }
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "Hubo un problema el procesar la petición" });
  }
};

export const updateClient = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;
  const url = `${request.protocol}://${request.get("host")}`;

  const {
    person,
    address,
    dpi,
    phones,
  }: {
    person: PersonAPI;
    address: AddressAPI;
    dpi: DpiAPI;
    phones: PhoneAPI[];
  } = request.body;

  const phoneInstances: PhoneAPI[] = phones.map((phone) => ({
    type: phone.type,
    number: phone.number,
  }));

  try {
    sequelize.transaction(async (t: Transaction) => {
      // Update the person
      const client = await Client.findOne({
        where: { id },
        include: [
          {
            model: Person,
            as: "person",
            include: [
              {
                model: Address,
                as: "address",
              },
              {
                model: Phone,
                as: "phones",
              },
            ],
          },
        ],
        transaction: t,
      });

      if (!client) {
        const message = `No se ha encontrado el cliente`;
        response.status(404).json({ message });
        return;
      }

      const person = await client.getPerson();

      const existingDpi = await Dpi.findOne({
        where: {
          number: dpi.number,
          personId: {
            [Op.ne]: person.id,
          },
        },
      });

      if (existingDpi) {
        console.log(existingDpi);
        return response.status(409).json({
          message: "El DPI ya está en uso!",
        });
      }

      const existingNit = await Person.findOne({
        where: {
          nitNumber: person.nitNumber,
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

      const clientPerson = await client.getPerson();

      if (!clientPerson) {
        const message = `No se han encontrado los datos personales del cliente`;
        response.status(500).json({ message });
        return;
      }

      clientPerson.firstNames = person.firstNames;
      clientPerson.lastNames = person.lastNames;

      if (person.birthday) {
        clientPerson.birthday = person.birthday;
      }

      if (person.email) {
        clientPerson.email = person.email;
      }

      //TODO: Update client
      //await client.touch({ transaction: t, hooks: true });

      await clientPerson.save({ transaction: t, hooks: true });

      let dpiFrontUrl = null;
      let dpiBackUrl = null;

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

      const clientDpi = await clientPerson.getDpi();
      clientDpi.number = dpi.number;
      clientDpi.dpiFrontUrl = dpiFrontUrl;
      clientDpi.dpiBackUrl = dpiBackUrl;

      await clientDpi.save({ transaction: t, hooks: true });

      const addressInstance = await clientPerson.getAddress();

      if (!addressInstance) {
        const message = `No se ha encontrado la direccion del cliente`;
        response.status(500).json({ message });
        return;
      }

      // TODO: Refactor to add department and municipality interfaces
      addressInstance.type = address.type;
      addressInstance.street = address.street;
      addressInstance.locality = address.locality;
      addressInstance.municipalityId = address.municipality;
      addressInstance.departmentId = address.department;
      addressInstance.zipCode = address.zipCode;

      await addressInstance.save({ transaction: t, hooks: true });

      if (!phoneInstances) {
        const message = `No se ha encontrado los teléfonos del cliente`;
        response.status(500).json({ message });
        return;
      }
      // Update the phones
      const existingPhones = await Phone.findAll({
        where: { personId: clientPerson.id },
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
            personId: clientPerson.id,
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

      response
        .status(200)
        .json({ client, message: "Cliente actualizado exitosamente!" });
    });
  } catch (error) {
    const message = `La transacción falló`;
    response.status(500).json({ message });
  }
};

//Refactor migrations, models to add softDelete functionalities
export const deleteClient = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  try {
    await sequelize.transaction(async (t) => {
      const client = await Client.findOne({
        where: { id },
        include: [
          {
            model: Person,
            as: "person",
            include: [
              {
                model: Address,
                as: "address",
              },
              {
                model: Phone,
                as: "phones",
              },
            ],
          },
        ],
        transaction: t,
      });

      if (!client) {
        const message = `No se ha encontrado el cliente`;
        response.status(404).json({ message });
        return;
      }

      const person = await client.getPerson();
      const dpi = await person.getDpi();
      const address = await person.getAddress();
      const phones = await person.getPhones();

      await Promise.all([
        client.destroy({ transaction: t }),
        address.destroy({ transaction: t }),
        dpi.destroy({ transaction: t }),
        ...phones.map((phone) => phone.destroy({ transaction: t })),
        person.destroy({ transaction: t }),
      ]);

      response.status(200).json({ message: "Cliente eliminado exitosamente" });
    });
  } catch (error) {
    const message = `La transacción falló`;
    response.status(500).json({ message });
  }
};

export const getClientsReport = async (
  request: AuthRequest,
  response: Response
) => {
  const { startDate, endDate } = request.body;

  // Start and End dates can't be empty
  if (!startDate || !endDate) {
    return response.status(400).json({
      message:
        "La fecha de inicio y la fecha del final del reporte son requeridas!",
    });
  }

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  // Start date can't be past End date
  if (isAfter(startDateObj, endDateObj)) {
    return response.status(400).json({
      message:
        "La fecha de inicio no puede ser posterior a la fecha del final del reporte!",
    });
  }

  const clients = await Client.findAll({
    where: {
      createdAt: {
        [Op.between]: [startDateObj, endDateObj],
      },
    },
  });

  const newClients = clients.filter((client) => {
    const createdAt = new Date(client.createdAt);
    return (
      createdAt >= new Date(startDateObj) && createdAt <= new Date(endDateObj)
    );
  });

  const clientsEntries = newClients.map((client) => ({
    date: client.createdAt.toISOString().split("T")[0],
  }));

  interface resultI {
    date: string;
    count: number;
  }

  const uniqueDates = new Set(clientsEntries.map((client) => client.date));
  const result: resultI[] = [];

  uniqueDates.forEach((date) => {
    const count = clientsEntries.filter(
      (client) => client.date === date
    ).length;
    result.push({ date, count });
  });

  const reportData = {
    startDate: startDateObj.toISOString().split("T")[0],
    endDate: endDateObj.toISOString().split("T")[0],
    clients: result,
  };

  response.json(reportData);
};

export const getClientsCount = async (
  request: AuthRequest,
  response: Response
) => {
  const { from, to }: { from?: string; to?: string } = request.query;
  try {
    let clientsCount;

    if (!from || !to) {
      // If either from or to is missing, return the whole count
      clientsCount = await Client.count();
    } else {
      // If both from and to are provided, use the where clause
      if (isAfter(new Date(from), new Date(to))) {
        const message = `La fecha de inicio no puede estar después de la fecha final !`;
        response.status(422).json({ message });
        return;
      }

      clientsCount = await Client.count({
        where: {
          createdAt: {
            [Op.between]: [from, to],
          },
        },
      });
    }

    clientsCount = clientsCount || 0;

    response.status(200).json({ count: clientsCount });
  } catch (error) {
    response.status(500).json(error);
  }
};

export default {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientsReport,
  getClientsCount,
};

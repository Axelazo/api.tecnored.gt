import { sequelize } from "../models";
import { Response } from "express";
import {
  AddressInterface,
  PhoneInterface,
  DpiInterface,
  AuthRequest,
} from "../ts/interfaces/app-interfaces";
import { Transaction } from "sequelize";
import Dpi from "../models/Dpi";
import Person from "../models/Person";
import Address from "../models/Address";
import Client from "../models/Client";
import Phone from "../models/Phone";
import { randomInt } from "crypto";

async function generateClientNumber() {
  let clientNumber;
  let collision = true;
  while (collision) {
    // Step 1: Retrieve the current count of clients
    const clientCount = await Client.count();

    // Step 2: Generate a random 8-digit number
    const random = randomInt(10000000, 99999999);

    // Step 3: Combine the client count and the random number
    clientNumber = parseInt(
      clientCount.toString().padStart(8, "0") + random
    ).toString();

    // Step 4: Check for collisions
    const existingClient = await Client.findOne({ where: { clientNumber } });
    collision = !!existingClient;
  }

  // Step 5: Return the generated client number
  return clientNumber ? clientNumber : "";
}

// TODO: Implement validation, delete sensitive fields,
export const createClient = async (
  request: AuthRequest,
  response: Response
) => {
  const {
    firstNames,
    lastNames,
    birthday,
    address,
    dpi,
    phones,
  }: {
    firstNames: string;
    lastNames: string;
    birthday: Date;
    address: AddressInterface;
    dpi: DpiInterface;
    phones: PhoneInterface[];
  } = request.body;

  const url = `${request.protocol}://${request.get("host")}`;
  const phoneInstances: PhoneInterface[] = phones.map((phone) => ({
    type: phone.type,
    number: phone.number,
  }));

  try {
    sequelize.transaction(async (t: Transaction) => {
      //Creates the person
      const newPerson = await Person.create(
        {
          firstNames,
          lastNames,
          birthday,
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
        throw new Error("No hay files!");
      }

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
          ...address,
          personId: newPerson.id,
        },
        {
          transaction: t,
        }
      );

      //Creates the unique clientNumber
      const clientNumber = await generateClientNumber();

      //Finaly we create the client when the whole data is complete!
      const newClient = await Client.create(
        { personId: newPerson.id, clientNumber },
        { transaction: t }
      );

      response.status(200).json({
        data: {
          clientId: newClient.dataValues.id,
        },
      });
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
        .status(404)
        .json({ message: "No se ha encontrado ningun cliente" });
    }
  } catch (error) {
    console.log(error);
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

  const {
    firstNames,
    lastNames,
    birthday,
    address,
    phones,
  }: {
    firstNames: string;
    lastNames: string;
    birthday: Date;
    dpi: DpiInterface;
    address: AddressInterface;
    phones: PhoneInterface[];
  } = request.body;

  const phoneInstances: PhoneInterface[] = phones.map((phone) => ({
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

      if (!person) {
        const message = `No se han encontrado los datos personales del cliente`;
        response.status(500).json({ message });
        return;
      }

      person.firstNames = firstNames;
      person.lastNames = lastNames;
      person.birthday = birthday;

      await person.save({ transaction: t, hooks: true });

      const addressInstance = await person.getAddress();

      // Update the address
      /*       const addressInstance = await Address.findOne({
        where: { personId: client.personId },
        transaction: t,
      }); */

      if (!addressInstance) {
        const message = `No se ha encontrado la direccion del cliente`;
        response.status(500).json({ message });
        return;
      }

      addressInstance.street = address.street;
      addressInstance.city = address.city;
      addressInstance.state = address.state;
      addressInstance.zipCode = address.zipCode;

      if (!phoneInstances) {
        const message = `No se ha encontrado los teléfonos del cliente`;
        response.status(500).json({ message });
        return;
      }
      // Update the phones
      const existingPhones = await Phone.findAll({
        where: { personId: person.id },
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
            personId: person.id,
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

      response.status(200).json({ client });
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
    console.log(error);
    const message = `La transacción falló`;
    response.status(500).json({ message });
  }
};

export default {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};

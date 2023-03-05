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
import Location from "../models/Location";
import Client from "../models/Client";
import Phone from "../models/Phone";

// TODO: Find why the personId = newPerson.id is not taking into  account when inserting data
// TODO: Need to use .setPerson method, but maybe it can't be needed
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

      //Creates the dpi
      const newDpi = await Dpi.create(
        {
          ...dpi,
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

      //Creates the location for the address above
      const newLocation = await Location.create(
        {
          ...address.location,
          addressId: newAddress.id,
        },
        {
          transaction: t,
        }
      );

      //Finaly we create the client when the whole data is complete!
      const newClient = await Client.create(
        { personId: newPerson.id },
        { transaction: t }
      );

      response.status(200).json({
        data: {
          newPerson,
          newDpi,
          newClient,
          newAddress,
          newLocation,
          newPhones,
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
              model: Address,
              as: "address",
              include: [
                {
                  model: Location,
                  as: "location",
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
                include: [
                  {
                    model: Location,
                    as: "location",
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

      const locationInstance = await addressInstance.getLocation();

      /*       const locationInstance = await Location.findOne({
        where: { addressId: addressInstance.id },
        transaction: t,
      }); */

      if (!locationInstance) {
        const message = `No se ha encontrado la ubicación de la dirección del cliente`;
        response.status(500).json({ message });
        return;
      }

      locationInstance.latitude = address.location.latitude;
      locationInstance.longitude = address.location.longitude;

      await locationInstance.save({ transaction: t, hooks: true });
      await addressInstance.save({ transaction: t, hooks: true });

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

export default { createClient, getAllClients, getClientById, updateClient };

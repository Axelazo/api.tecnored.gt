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

//TODO: Find why the personId = newPerson.id is not taking into  account when inserting data
//TODO: Need to use .setPerson method, but maybe it can't be needed
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

      /*       newClient.setPerson(newPerson);
      newDpi.setPerson(newPerson);
      newAddress.setPerson(newPerson);
      newLocation.setAddress(newAddress);
      newPhones.forEach((phone) => {
        phone.setPerson(newPerson);
      }); */

      response.status(200).json({
        newPerson,
        newDpi,
        newClient,
        newAddress,
        newLocation,
        newPhones,
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
    const clients = await Person.findAll({
      include: [
        {
          model: Client,
          as: "client",
        },
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
        { model: Phone, as: "phones" },
      ],
    });

    const clientsAmount = clients.length;

    if (clientsAmount > 0) {
      response.status(200).json(clients);
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

export default { createClient, getAllClients };

import { Response } from "express";
import {
  AddressAPI,
  AuthRequest,
  LocationAPI,
} from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import Client from "../models/Client";
import Service from "../models/Service";
import Plan from "../models/Plan";
import ServicesOwners from "../models/ServicesOwners";
import ServicesAddress from "../models/ServicesAddress";
import ServicePlanMapping from "../models/ServicePlanMapping";
import { generateUniqueNumber } from "../utils/generation";

export const createServiceForClient = async (
  request: AuthRequest,
  response: Response
) => {
  const {
    clientId,
    ipAddress,
    planId,
    address,
    location,
  }: {
    clientId: number;
    ipAddress: string;
    planId: number;
    address: AddressAPI;
    location: LocationAPI;
  } = request.body;

  try {
    let serviceNumber: string | null = null; // Declare serviceNumber outside the if block

    sequelize.transaction(async (t: Transaction) => {
      // Check if location exists
      if (!location) {
        const message = `La ubicacion es requerida!`;
        response.status(422).json({ message });
        return;
      }
      // Check if location properties exists
      if (!location.latitude || !location.longitude || location.addressId) {
        const message = `La longitud / latitud es requerida!`;
        response.status(422).json({ message });
        return;
      }

      // Check if the client exists
      const client = await Client.findByPk(clientId, { transaction: t });
      if (!client) {
        return response.status(404).json({
          message: "No se ha encontrado el cliente!",
        });
      }

      // Check if the plan exists
      const plan = await Plan.findByPk(planId, { transaction: t });
      if (!plan) {
        return response.status(404).json({
          message: "No se ha encontrado el plan!",
        });
      }

      const names = await plan.getNames();
      const prices = await plan.getPrices();
      const speeds = await plan.getSpeeds();

      names.sort((a, b) => a.start.getTime() - b.start.getTime());
      prices.sort((a, b) => a.start.getTime() - b.start.getTime());
      speeds.sort((a, b) => a.start.getTime() - b.start.getTime());

      const mostRecentNameId = names[0].id;
      const mostRecentPriceId = prices[0].id;
      const mostRecentSpeedId = speeds[0].id;

      //Creates the unique clientNumber
      serviceNumber = await generateUniqueNumber(8, "serviceNumber", Service);

      if (!serviceNumber) {
        response
          .status(500)
          .json({ message: "Hubo un error al generar el plan" });
        return;
      }

      const newServiceAddress = await ServicesAddress.create(
        {
          type: address.type,
          street: address.street,
          locality: address.locality,
          municipalityId: address.municipality,
          departmentId: address.department,
          zipCode: address.zipCode,
        },
        {
          transaction: t,
        }
      );

      //Create the new Service
      const newService = await Service.create(
        {
          serviceNumber: serviceNumber,
          ipAddress: ipAddress,
          addressId: newServiceAddress.dataValues.id,
          planId: planId,
        },
        { transaction: t }
      );

      // Create the entry in the ServicesOwners table to associate the client with the service
      const newServiceOwner = await ServicesOwners.create(
        {
          clientId: clientId,
          serviceId: newService.dataValues.id,
          start: new Date(),
        },
        { transaction: t }
      );

      // Create the mapping for this Service (combination of plan, name and speed)
      const newServicePlanMapping = await ServicePlanMapping.create(
        {
          serviceId: newService.dataValues.id,
          planNameId: mostRecentNameId,
          planPriceId: mostRecentPriceId,
          planSpeedId: mostRecentSpeedId,
          start: new Date(),
        },
        { transaction: t }
      );

      response.status(200).json({
        id: newService.dataValues.id,
      });
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

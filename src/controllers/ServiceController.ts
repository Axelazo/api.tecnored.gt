import { Response } from "express";
import { AuthRequest, LocationAPI } from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction, Op } from "sequelize";
/* import Client from "../models/Client";
import Service from "../models/Service";
import Plan from "../models/Plan";
import ServicesOwners from "../models/ServicesOwners";
import ServicesAddress from "../models/ServicesAddress";
import ServicePlanMapping from "../models/ServicePlanMapping";
import Location from "../models/Location";
import PlanName from "../models/PlanName";
import PlanPrice from "../models/PlanPrice";
import PlanSpeed from "../models/PlanSpeed";
import Router from "../models/Router";
import ServiceStatus from "../models/ServiceStatus";
import Status from "../models/Status"; */
import {
  Client,
  Service,
  Plan,
  ServicesOwners,
  ServicesAddress,
  ServicePlanMapping,
  Location,
  PlanName,
  PlanPrice,
  PlanSpeed,
  Router,
  ServiceStatus,
  Status,
  Municipality,
  Department,
  ServicePlan,
  Person,
  Address,
  Ticket,
  TicketStatuses,
} from "../models/Relationships";
import { generateUniqueNumber } from "../utils/generation";
import { isValidIPv4, isIPinRange } from "../utils/ip";
import TicketAssignees from "../models/TicketAssignees";

export const createServiceForClient = async (
  request: AuthRequest,
  response: Response
) => {
  const {
    clientId,
    ipAddress,
    planId,
    location,
    start,
    routerId,
    employeeId,
  }: {
    clientId: number;
    ipAddress: string;
    planId: number;
    location: LocationAPI;
    start?: Date;
    routerId: number;
    employeeId: number;
  } = request.body;

  try {
    // TODO - Tasks: Create entry on the comissions table for the given employeeId
    // TODO = Tasks: Create Service from given date
    // TODO - QOL -> Bring from the backend the smallest unused IP address

    let serviceNumber: string | null = null; // Declare serviceNumber outside the if block

    sequelize.transaction(async (t: Transaction) => {
      // Check if the client exists
      const client = await Client.findByPk(clientId, { transaction: t });

      if (!client) {
        return response.status(404).json({
          message: "No se ha encontrado el cliente!",
        });
      }

      // Check if the router exists
      const router = await Router.findByPk(routerId, { transaction: t });

      if (!router) {
        return response.status(404).json({
          message: "No se ha encontrado el router!",
        });
      }

      // Check if the address is provided
      if (!ipAddress) {
        const message = `La dirección IP es requerida!`;
        response.status(422).json({ message });
        return;
      }

      // Check if the IP is a valid IPV4 and it's between range
      if (!isValidIPv4(ipAddress)) {
        const message = `La dirección IP no es válida!`;
        response.status(422).json({ message });
        return;
      }

      if (!isIPinRange(ipAddress, router.ipAddress)) {
        const message = `La dirección IP no está dentro del rango!`;
        response.status(422).json({ message });
        return;
      }

      // Check if the given IP doesn't already exists on the database
      const service = await Service.findOne({
        where: { ipAddress },
      });

      // Check if the address is provided
      if (service) {
        const message = `La dirección IP ya está en uso!`;
        response.status(409).json({ message });
        return;
      }

      // Check if the plan exists
      const plan = await Plan.findByPk(planId, {
        include: [
          {
            model: PlanName,
            as: "names",
          },
          {
            model: PlanPrice,
            as: "prices",
          },
          {
            model: PlanSpeed,
            as: "speeds",
          },
        ],
        transaction: t,
      });
      if (!plan) {
        return response.status(404).json({
          message: "No se ha encontrado el plan!",
        });
      }

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

      let mostRecentNameId;
      let mostRecentPriceId;
      let mostRecentSpeedId;

      if (plan.names && plan.prices && plan.speeds) {
        const names = plan.names;
        const prices = plan.prices;
        const speeds = plan.speeds;

        names.sort((a, b) => b.start.getTime() - a.start.getTime());
        prices.sort((a, b) => b.start.getTime() - a.start.getTime());
        speeds.sort((a, b) => b.start.getTime() - a.start.getTime());

        mostRecentNameId = names[0].id;
        mostRecentPriceId = prices[0].id;
        mostRecentSpeedId = speeds[0].id;
      } else {
        const message = `No se ha encontrado la información relacionada al plan!`;
        response.status(500).json({ message });
        return;
      }

      //Creates the unique clientNumber
      serviceNumber = await generateUniqueNumber(8, "serviceNumber", Service);

      if (!serviceNumber) {
        response
          .status(500)
          .json({ message: "Hubo un error al generar el plan" });
        return;
      }

      // Get Address data from Client -> Person
      const person = await client.getPerson();

      if (!person) {
        response.status(500).json({
          message: "Hubo un error al obtener la información del cliente",
        });
        return;
      }

      const address = await person.getAddress();

      if (!address) {
        response.status(500).json({
          message:
            "Hubo un error al obtener la información de dirección cliente",
        });
        return;
      }

      // Create the entry in the Service table to associate the plan
      const newService = await Service.create(
        {
          serviceNumber: serviceNumber,
          ipAddress: ipAddress,
          routerId: router.id,
        },
        { transaction: t }
      );

      // Create the entry in the Services Addresses table to associate to the Plan
      const newServiceAddress = await ServicesAddress.create(
        {
          type: address.type,
          street: address.street,
          locality: address.locality,
          municipalityId: address.municipalityId,
          departmentId: address.departmentId,
          zipCode: address.zipCode,
          serviceId: newService.id,
        },
        {
          transaction: t,
        }
      );

      // Create the entry in the Locations table to associate to the Plan
      const newLocation = await Location.create(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          addressId: newServiceAddress.id,
        },
        { transaction: t }
      );

      // Create the entry in the ServicesOwners table to associate the client with the service
      const newServiceOwner = await ServicesOwners.create(
        {
          clientId: clientId,
          serviceId: newService.id,
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

      // Create a reference to the original Plan so if the plan is updated in the future, we would grab the planId and update the Service Plan Mapping to the new Plan properties
      const newServicePlan = await ServicePlan.create(
        {
          planId: plan.id,
          serviceId: newService.id,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: client.id,
      });
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

export const getAllServicesOfClient = async (
  request: AuthRequest,
  response: Response
) => {
  const { clientId } = request.params;
  try {
    const services = await ServicesOwners.findAll({
      include: [
        {
          model: Service,
          as: "service",
          include: [
            {
              model: ServicesAddress,
              as: "address",
              include: [
                {
                  model: Municipality,
                  as: "municipality",
                  include: [
                    {
                      model: Department,
                      as: "department",
                    },
                  ],
                },
              ],
            },
            {
              model: ServicePlanMapping,
              as: "servicePlanMappings",
              include: [
                {
                  model: PlanName,
                  as: "planName",
                },
                {
                  model: PlanPrice,
                  as: "planPrice",
                },
                {
                  model: PlanSpeed,
                  as: "planSpeed",
                },
              ],
            },
            {
              model: ServiceStatus,
              include: [{ model: Status }],
            },
            {
              model: Router,
              as: "router",
            },
          ],
        },
      ],
      where: {
        clientId,
      },
    });

    const formattedServices = services.map((serviceOwner) => {
      const service = serviceOwner.service;
      const servicePlanMappings = service?.servicePlanMappings || [];
      const serviceStatuses = service?.serviceStatuses || [];
      const address = `${service?.address?.municipality?.department?.name}, ${service?.address?.municipality?.name}`;

      return {
        id: service?.id,
        serviceNumber: service?.serviceNumber || "",
        ipAddress: service?.ipAddress || "",
        planName: servicePlanMappings[0]?.planName?.name || "",
        planSpeed: servicePlanMappings[0]?.planSpeed?.speed || "",
        planPrice: servicePlanMappings[0]?.planPrice?.price || "",
        status: serviceStatuses[0] || "",
        address: address || "",
        establishmentName: service?.router?.name || "",
      };
    });

    const servicesAmount = formattedServices.length;

    if (servicesAmount > 0) {
      response.status(200).json({ data: formattedServices });
    } else {
      response.status(204).json({ message: "No se ha encontrado ningun plan" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getServiceWithId = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;
  try {
    const service = await Service.findOne({
      include: [
        {
          model: ServicesAddress,
          as: "address",
          include: [
            {
              model: Municipality,
              as: "municipality",
              include: [
                {
                  model: Department,
                  as: "department",
                },
              ],
            },
          ],
        },
        {
          model: ServicePlanMapping,
          as: "servicePlanMappings",
          include: [
            {
              model: PlanName,
              as: "planName",
            },
            {
              model: PlanPrice,
              as: "planPrice",
            },
            {
              model: PlanSpeed,
              as: "planSpeed",
            },
          ],
          order: [["start", "DESC"]], // Order by start date in descending order
          limit: 1, // Limit to the most recent record
        },
        {
          model: ServiceStatus,
          include: [{ model: Status }],
        },
        {
          model: Router,
          as: "router",
        },
        {
          model: ServicesOwners,
          as: "owners",
          include: [
            {
              model: Client,
              as: "client",
              include: [
                {
                  model: Person,
                  as: "person",
                  include: [
                    {
                      model: Address,
                      as: "address",
                    },
                  ],
                },
              ],
            },
          ],
          order: [["start", "DESC"]], // Order by start date in descending order
          limit: 1, // Limit to the most recent record
        },
      ],
      where: {
        id,
      },
    });

    if (service) {
      response.status(200).json({ data: service });
    } else {
      response.status(204).json({ message: "No se ha encontrado ningun plan" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getAllServicesInGeographicArea = async (
  request: AuthRequest,
  response: Response
) => {
  try {
    const { south, west, north, east } = request.query;

    console.log(`Request query is: ` + request.query);

    if (!south || !west || !north || !east) {
      return response
        .status(409)
        .json({ message: "Las coordenadas son requeridas!" });
    }

    const parseNumeric = (value: any) => {
      if (typeof value === "string") {
        const numericValue = parseFloat(value);
        return !isNaN(numericValue) ? numericValue : null;
      }
      return null;
    };

    const numericSouth = parseNumeric(south);
    const numericWest = parseNumeric(west);
    const numericNorth = parseNumeric(north);
    const numericEast = parseNumeric(east);

    if (
      numericSouth === null ||
      numericWest === null ||
      numericNorth === null ||
      numericEast === null
    ) {
      console.error("Some values couldn't be parsed as numbers.");
    }

    // Query services within the specified geographic area
    const services = await Service.findAll({
      include: [
        {
          model: ServicesAddress,
          as: "address",
          include: [
            {
              model: Location,
              as: "location",
              where: {
                latitude: {
                  [Op.between]: [numericSouth, numericNorth],
                },
                longitude: {
                  [Op.between]: [numericWest, numericEast],
                },
              },
            },
          ],
        },
      ],
    });

    // Filter services to include only those with a non-null and non-null property location
    const formattedServices = services
      .filter((service) => service.address !== null)
      .map((service) => ({
        id: service.id,
        latitude: service.address?.location?.latitude ?? null,
        longitude: service.address?.location?.longitude ?? null,
      }));

    if (formattedServices.length > 0) {
      response
        .status(200)
        .json({ data: formattedServices, unformatted: services });
    } else {
      response.status(204).json({ message: "No se ha encontrado ningun plan" });
    }
  } catch (error) {
    response.status(500).json(error);
  }
};

export const deleteService = async (
  request: AuthRequest,
  response: Response
) => {
  const { id } = request.params;

  if (!id) {
    return response
      .status(409)
      .json({ message: "El id del servicio es requerido!" });
  }

  try {
    await sequelize.transaction(async (t: Transaction) => {
      const existingService = await Service.findByPk(id);

      if (!existingService) {
        return response
          .status(404)
          .json({ message: "El servicio indicado no existe" });
      }

      // Delete al related data
      await ServiceStatus.destroy({
        where: {
          serviceId: existingService.id,
        },
        transaction: t,
      });

      const existingServiceAdress = await ServicesAddress.findOne({
        where: {
          serviceId: existingService.id,
        },
        transaction: t,
      });

      if (existingServiceAdress) {
        await Location.destroy({
          where: {
            addressId: existingServiceAdress.id,
          },
          transaction: t,
        });
      }

      await ServicesAddress.destroy({
        where: {
          serviceId: existingService.id,
        },
        transaction: t,
      });

      await ServicePlan.destroy({
        where: {
          serviceId: existingService.id,
        },
        transaction: t,
      });

      await ServicePlanMapping.destroy({
        where: {
          serviceId: existingService.id,
        },
        transaction: t,
      });

      await ServicesOwners.destroy({
        where: {
          serviceId: existingService.id,
        },
        transaction: t,
      });

      const existingServiceTickets = await Ticket.findAll({
        where: {
          serviceId: existingService.id,
        },
        transaction: t,
      });

      for (const existingServiceTicket of existingServiceTickets) {
        await TicketStatuses.destroy({
          where: {
            ticketId: existingServiceTicket.id,
          },
          transaction: t,
        });

        await TicketAssignees.destroy({
          where: {
            ticketId: existingServiceTicket.id,
          },
          transaction: t,
        });
      }

      await Ticket.destroy({
        where: {
          serviceId: existingService.id,
        },
        transaction: t,
      });

      await existingService.destroy({ transaction: t });
    });

    response.status(200).json({
      message:
        "El servicio y su información asociada ha sido eliminado exitosamente",
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error });
  }
};

export default {
  createServiceForClient,
  getAllServicesOfClient,
  getAllServicesInGeographicArea,
  getServiceWithId,
  deleteService,
};

import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import { sequelize } from "../models";
import { Transaction } from "sequelize";
import Plan from "../models/Plan";
import PlanPrice from "../models/PlanPrice";
import PlanName from "../models/PlanName";
import PlanSpeed from "../models/PlanSpeed";
import { calculateRealValue } from "../utils/misc";
import ServicePlan from "../models/ServicePlan";

export const createPlan = async (request: AuthRequest, response: Response) => {
  const {
    name,
    speed,
    price,
  }: {
    name: string;
    speed: number;
    price: number;
  } = request.body;
  try {
    sequelize.transaction(async (t: Transaction) => {
      if (!name) {
        const message = `El nombre del plan es requerido!`;
        response.status(422).json({ message });
        return;
      }

      if (!speed) {
        const message = `La velocidad del plan es requerida!`;
        response.status(422).json({ message });
        return;
      }

      if (!price) {
        const message = `El precio del plan es requerido!`;
        response.status(422).json({ message });
        return;
      }

      const planNames = await PlanName.findAll();
      let planNameExists = false;
      planNames.map((planName) => {
        if (planName.name === name) {
          planNameExists = true;
          const message = `El nombre del plan ya existe!`;
          response.status(409).json({ message });
          return;
        }
      });

      // If plan name exists, return early
      if (planNameExists) {
        return;
      }

      //Create the plan reference
      const newPlan = await Plan.create({}, { transaction: t });

      // Creates the first name for this plan, valid from today onwards!
      const newPlanName = await PlanName.create(
        { name: name, start: new Date(), planId: newPlan.dataValues.id },
        { transaction: t }
      );

      // Creates the first speed for this plan, valid from today onwards!
      const newPlanSpeed = await PlanSpeed.create(
        {
          speed: speed,
          start: new Date(),
          realSpeed: calculateRealValue(speed, 5, 0.5),
          planId: newPlan.dataValues.id,
        },
        { transaction: t }
      );

      // Creates the first price for this plan, valid from today onwards!
      const newPlanPrice = await PlanPrice.create(
        {
          price,
          start: new Date(),
          planId: newPlan.dataValues.id,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: newPlan.dataValues.id,
      });
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

export const getAllPlans = async (request: AuthRequest, response: Response) => {
  try {
    const plans = await Plan.findAll({
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
    });

    const formattedPlans = plans.map((plan) => {
      const planNames = plan.names || [];
      const planPrices = plan.prices || [];
      const planSpeeds = plan.speeds || [];

      if (planNames && planPrices && planSpeeds) {
        planNames.sort((a, b) => b.start.getTime() - a.start.getTime());
        planPrices.sort((a, b) => b.start.getTime() - a.start.getTime());
        planSpeeds.sort((a, b) => b.start.getTime() - a.start.getTime());
      }

      return {
        id: plan.id,
        name: planNames[0].name || "",
        price: planPrices[0].price || "",
        speed: planSpeeds[0].speed || "",
      };
    });

    const plansAmount = formattedPlans.length;

    if (plansAmount > 0) {
      response.status(200).json({ data: formattedPlans, count: plans.length });
    } else {
      response
        .status(204)
        .json({ message: "No se ha encontrado ningun plan!" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

export const getPlanById = async (request: AuthRequest, response: Response) => {
  const { id } = request.params;

  if (!id) {
    return response.status(409).json({
      message: "El id del plan es requerido!",
    });
  }

  if (isNaN(parseInt(id))) {
    return response.status(409).json({
      message: "El id especificado debe ser un número!",
    });
  }

  try {
    const plan = await Plan.findByPk(id);

    if (!plan) {
      response.status(404).json({ message: "No se ha encontrado el plan" });
      return;
    }

    const planNames = plan?.names || [];
    const planPrices = plan?.prices || [];
    const planSpeeds = plan?.speeds || [];

    if (planNames && planPrices && planSpeeds) {
      planNames.sort((a, b) => b.start.getTime() - a.start.getTime());
      planPrices.sort((a, b) => b.start.getTime() - a.start.getTime());
      planSpeeds.sort((a, b) => b.start.getTime() - a.start.getTime());
    }

    const formatedPlan = {
      id: plan.dataValues.id,
      names: planNames,
      prices: planPrices,
      speeds: planSpeeds,
    };

    response.status(200).json({ data: formatedPlan });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

export const updatePlan = async (request: AuthRequest, response: Response) => {
  const {
    name,
    speed,
    price,
  }: {
    name: string;
    speed: number;
    price: number;
  } = request.body;

  const { id } = request.params;
  const planId = id;

  if (!id) {
    return response.status(409).json({
      message: "El id del plan es requerido!",
    });
  }

  if (isNaN(parseInt(id))) {
    return response.status(409).json({
      message: "El id especificado debe ser un número!",
    });
  }

  try {
    sequelize.transaction(async (t: Transaction) => {
      // Find the plan
      const plan = await Plan.findOne({
        where: { id },
      });

      // Return if don't exists
      if (!plan) {
        const message = `No se han encontrado el plan`;
        response.status(404).json({ message });
        return;
      }

      //Search for same name
      const planName = await PlanName.findOne({
        where: { planId, name },
      });

      //Return if exists
      if (planName) {
        const message = `El nombre del plan ya existe!`;
        response.status(409).json({ message });
        return;
      }

      //If plan exists modify price (insert new register)
      const newPlanName = await PlanName.create(
        { name: name, start: new Date(), planId: plan.dataValues.id },
        { transaction: t }
      );

      const newPlanSpeed = await PlanSpeed.create(
        {
          speed: speed,
          start: new Date(),
          realSpeed: calculateRealValue(speed, 5, 0.5),
          planId: plan.dataValues.id,
        },
        { transaction: t }
      );

      const newPlanPrice = await PlanPrice.create(
        {
          price,
          start: new Date(),
          planId: plan.dataValues.id,
        },
        { transaction: t }
      );

      response.status(200).json({
        id: plan.dataValues.id,
      });
    });
  } catch (error) {
    const message = `La transacción falló: Error ${error}`;
    response.status(500).json({
      message,
    });
  }
};

export const deletePlan = async (request: AuthRequest, response: Response) => {
  const { id } = request.params;

  if (!id) {
    return response.status(409).json({
      message: "El id del plan es requerido!",
    });
  }

  if (isNaN(parseInt(id))) {
    return response.status(409).json({
      message: "El id especificado debe ser un número!",
    });
  }
  try {
    const plan = await Plan.findByPk(id);

    if (!plan) {
      response.status(404).json({ message: "No se ha encontrado el plan" });
      return;
    }

    sequelize.transaction(async (t: Transaction) => {
      // TODO Check if the plan is associated with any services: Check if the plan is being used by any services in the ServicePlan table. If the plan is still associated with active services, you might want to prevent its deletion, or alternatively, you could handle cascading deletions or update the services with a new plan before deleting the existing plan.

      // TODO Check if the plan is part of any mappings: The ServicePlanMapping table seems to contain references to different plan attributes like planPriceId, planSpeedId, and planNameId. Make sure that the plan you intend to delete is not associated with any mappings in this table.

      const existingServices = await ServicePlan.findAll({
        where: {
          planId: id,
        },
      });

      if (existingServices.length > 0) {
        response
          .status(404)
          .json({ message: "Existen servicios asociados al plan!" });
        return;
      }

      // Delete plan names associated with the plan
      await PlanName.destroy({
        where: { planId: id },
        transaction: t,
      });

      // Delete plan speeds associated with the plan
      await PlanSpeed.destroy({
        where: { planId: id },
        transaction: t,
      });

      // Delete plan prices associated with the plan
      await PlanPrice.destroy({
        where: { planId: id },
        transaction: t,
      });

      // Delete the plan itself
      await plan.destroy({ transaction: t });

      response.status(200).json({
        message: "El plan ha sido eliminado exitosamente",
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
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan,
};

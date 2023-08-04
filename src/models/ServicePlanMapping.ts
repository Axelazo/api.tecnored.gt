import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Service from "./Service";
import PlanPrice from "./PlanPrice";
import PlanName from "./PlanName";
import PlanSpeed from "./PlanSpeed";

class ServicePlanMapping extends Model<
  InferAttributes<ServicePlanMapping>,
  InferCreationAttributes<ServicePlanMapping>
> {
  declare id: CreationOptional<number>;
  declare serviceId: ForeignKey<Service["id"]>;
  declare planPriceId: ForeignKey<PlanPrice["id"]>;
  declare planNameId: ForeignKey<PlanName["id"]>;
  declare planSpeedId: ForeignKey<PlanSpeed["id"]>;
  declare start: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

ServicePlanMapping.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    serviceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Service,
        key: "id",
      },
    },
    planPriceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: PlanPrice,
        key: "id",
      },
    },
    planNameId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: PlanName,
        key: "id",
      },
    },
    planSpeedId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: PlanSpeed,
        key: "id",
      },
    },
    start: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "servicePlanMapping",
    sequelize,
  }
);

export default ServicePlanMapping;

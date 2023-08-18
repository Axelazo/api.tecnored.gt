import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./index";
import Router from "./Router";
import ServicesAddress from "./ServicesAddress";
import ServicePlanMapping from "./ServicePlanMapping";
import ServiceStatus from "./ServiceStatus";

class Service extends Model<
  InferAttributes<Service>,
  InferCreationAttributes<Service>
> {
  declare id: CreationOptional<number>;
  declare serviceNumber: string;
  declare ipAddress: string;
  declare routerId: ForeignKey<Router["id"]>;

  declare address?: NonAttribute<ServicesAddress>;
  declare servicePlanMappings?: NonAttribute<ServicePlanMapping[]>;
  declare serviceStatuses: NonAttribute<ServiceStatus[]>;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Service.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    serviceNumber: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    ipAddress: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    routerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Router,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },

  {
    tableName: "services",
    sequelize,
  }
);

export default Service;

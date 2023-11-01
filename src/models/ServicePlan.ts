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
import Plan from "./Plan";

class ServicePlan extends Model<
  InferAttributes<ServicePlan>,
  InferCreationAttributes<ServicePlan>
> {
  declare id: CreationOptional<number>;
  declare planId: ForeignKey<Plan["id"]>;
  declare serviceId: ForeignKey<Service["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

ServicePlan.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    planId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Plan,
        key: "id",
      },
    },
    serviceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Service,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "servicePlans",
    sequelize,
  }
);

export default ServicePlan;

import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Association,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "./index";
import PlanPrice from "./PlanPrice";
import PlanName from "./PlanName";
import PlanSpeed from "./PlanSpeed";
import ServicePlan from "./ServicePlan";

class Plan extends Model<InferAttributes<Plan>, InferCreationAttributes<Plan>> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare getNames: HasManyGetAssociationsMixin<PlanName>;
  declare getPrices: HasManyGetAssociationsMixin<PlanPrice>;
  declare getSpeeds: HasManyGetAssociationsMixin<PlanSpeed>;

  declare static associations: {
    names: Association<Plan, PlanName>;
    prices: Association<Plan, PlanPrice>;
    speeds: Association<Plan, PlanSpeed>;
  };
}

Plan.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "plans",
    sequelize,
  }
);

Plan.hasMany(PlanPrice, { foreignKey: "planId", as: "prices" });
Plan.hasMany(PlanName, { foreignKey: "planId", as: "names" });
Plan.hasMany(PlanSpeed, { foreignKey: "planId", as: "speeds" });
PlanPrice.belongsTo(Plan, { foreignKey: "planId", as: "planPrice" });
PlanName.belongsTo(Plan, { foreignKey: "planId", as: "planName" });
PlanSpeed.belongsTo(Plan, { foreignKey: "planId", as: "planSpeed" });

Plan.hasMany(ServicePlan, { foreignKey: "planId" });
ServicePlan.belongsTo(Plan, { foreignKey: "planId" });

export default Plan;

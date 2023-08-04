import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Plan from "./Plan";

class PlanSpeed extends Model<
  InferAttributes<PlanSpeed>,
  InferCreationAttributes<PlanSpeed>
> {
  declare id: CreationOptional<number>;
  declare speed: number;
  declare realSpeed: number;
  declare start: Date;
  declare planId: ForeignKey<Plan["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

PlanSpeed.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    speed: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    realSpeed: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    start: {
      allowNull: false,
      type: DataTypes.DATE,
    },

    planId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Plan,
        key: "id",
      },
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "planSpeeds",
    sequelize,
  }
);

export default PlanSpeed;

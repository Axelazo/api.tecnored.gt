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

class PlanName extends Model<
  InferAttributes<PlanName>,
  InferCreationAttributes<PlanName>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare start: Date;
  declare planId: ForeignKey<Plan["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

PlanName.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
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
    tableName: "planNames",
    sequelize,
  }
);

export default PlanName;

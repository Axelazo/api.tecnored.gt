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

class PlanPrice extends Model<
  InferAttributes<PlanPrice>,
  InferCreationAttributes<PlanPrice>
> {
  declare id: CreationOptional<number>;
  declare price: number;
  declare start: Date;
  declare planId: ForeignKey<Plan["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

PlanPrice.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    price: {
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
    tableName: "planPrices",
    sequelize,
  }
);

export default PlanPrice;

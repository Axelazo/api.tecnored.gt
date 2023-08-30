import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "./index";
import Position from "./Position";
import Establishment from "./Establishment";

class Area extends Model<InferAttributes<Area>, InferCreationAttributes<Area>> {
  declare id: CreationOptional<number>;
  declare name: string;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare static associations: {
    positions: Association<Area, Position>;
  };
}

Area.init(
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "areas",
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Area;

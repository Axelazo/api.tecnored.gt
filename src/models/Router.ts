import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import Establishment from "./Establishment";
import { sequelize } from "./index";

class Router extends Model<
  InferAttributes<Router>,
  InferCreationAttributes<Router>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare ipAddress: string;
  declare establishmentId: ForeignKey<Establishment["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Router.init(
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
    ipAddress: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    establishmentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Establishment,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "routers",
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Router;

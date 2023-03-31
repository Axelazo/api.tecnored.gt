import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "./index";
import Router from "./Router";

class Establishment extends Model<
  InferAttributes<Establishment>,
  InferCreationAttributes<Establishment>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare latitude: string;
  declare longitude: string;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Establishment.init(
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
    latitude: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    longitude: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "establishments",
    sequelize,
  }
);

Establishment.hasMany(Router, { as: "routers" });
Router.belongsTo(Establishment, {
  foreignKey: "establishmentId",
  as: "routers",
});

export default Establishment;

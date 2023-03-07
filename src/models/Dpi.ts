import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  Association,
  HasOneSetAssociationMixin,
} from "sequelize";

import { sequelize } from "./index";
import Person from "./Person";

class Dpi extends Model<InferAttributes<Dpi>, InferCreationAttributes<Dpi>> {
  declare id: CreationOptional<number>;
  declare number: string;
  declare dpiFrontUrl: string; // for nullable fields
  declare dpiBackUrl: string;
  declare personId: ForeignKey<Person["id"]>;

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare setPerson: HasOneSetAssociationMixin<Person, number>;

  declare static associations: {
    projects: Association<Dpi, Person>;
  };
}

Dpi.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    number: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isNumeric: {
          msg: "Dpi can contain only numbers",
        },
        len: {
          args: [13, 13],
          msg: "Name needs to be at least 3 chars",
        },
      },
    },
    dpiBackUrl: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    dpiFrontUrl: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    personId: {
      type: DataTypes.INTEGER,
      references: {
        model: "persons",
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "dpis",
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Dpi;

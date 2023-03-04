import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "./index";
import Dpi from "./Dpi";
import Client from "./Client";

class Person extends Model<
  InferAttributes<Person>,
  InferCreationAttributes<Person>
> {
  declare id: CreationOptional<number>;
  declare firstNames: string;
  declare lastNames: string; // for nullable fields
  declare birthday: Date;
  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare static associations: {
    dpis: Association<Person, Dpi>;
  };
}

Person.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    firstNames: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 255],
          msg: "Name needs to be at least 3 chars",
        },
      },
    },
    lastNames: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 255],
          msg: "Last Name needs to be at least 3 chars",
        },
      },
    },
    birthday: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "persons",
    sequelize, // passing the `sequelize` instance is required
  }
);

Person.hasOne(Dpi, { foreignKey: "personId", as: "dpi" });
Dpi.belongsTo(Person, { foreignKey: "personId", as: "dpi" });

export default Person;

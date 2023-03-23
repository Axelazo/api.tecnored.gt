import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  HasOneGetAssociationMixin,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "./index";
import Dpi from "./Dpi";
import Client from "./Client";
import Address from "./Address";
import Phone from "./Phone";

class Person extends Model<
  InferAttributes<Person>,
  InferCreationAttributes<Person>
> {
  declare id: CreationOptional<number>;
  declare firstNames: string;
  declare lastNames: string; // for nullable fields
  declare birthday: CreationOptional<Date>;
  declare email: CreationOptional<string>;
  declare nitNumber: CreationOptional<string>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare getAddress: HasOneGetAssociationMixin<Address>;
  declare getPhones: HasManyGetAssociationsMixin<Phone>;
  declare getDpi: HasOneGetAssociationMixin<Dpi>;

  declare static associations: {
    dpi: Association<Person, Dpi>;
    address: Association<Person, Address>;
    phones: Association<Person, Phone>;
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
    email: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email must be valid",
        },
      },
    },
    nitNumber: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "persons",
    sequelize, // passing the `sequelize` instance is required
  }
);

Person.hasOne(Dpi, { foreignKey: "personId", as: "dpi" });
Dpi.belongsTo(Person, { foreignKey: "personId", as: "dpi" });

export default Person;

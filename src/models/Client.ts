import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasOneSetAssociationMixin,
  HasOneGetAssociationMixin,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./index";
import Person from "./Person";
import Service from "./Service";
import ServicesOwners from "./ServicesOwners";
import Address from "./Address";

class Client extends Model<
  InferAttributes<Client>,
  InferCreationAttributes<Client>
> {
  declare id: CreationOptional<number>;
  declare clientNumber: string;
  declare personId: ForeignKey<Person["id"]>;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare person?: NonAttribute<Person>;
  declare setPerson: HasOneSetAssociationMixin<Person, number>;
  declare getPerson: HasOneGetAssociationMixin<Person>;

  declare static associations: {
    person: Association<Client, Person>;
  };
}

Client.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    clientNumber: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    personId: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "clients",
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Client;

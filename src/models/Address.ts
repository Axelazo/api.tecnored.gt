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
} from "sequelize";
import { sequelize } from "./index";
import Location from "./Location";
import Person from "./Person";

class Address extends Model<
  InferAttributes<Address>,
  InferCreationAttributes<Address>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare street: string;
  declare city: string;
  declare state: string;
  declare zipCode: string;

  declare personId: ForeignKey<Person["id"]>;
  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare setPerson: HasOneSetAssociationMixin<Person, number>;
  declare getLocation: HasOneGetAssociationMixin<Location>;

  declare static associations: {
    person: Association<Address, Person>;
    location: Association<Address, Location>;
  };
}

Address.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    type: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    street: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    city: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    state: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    zipCode: {
      allowNull: true,
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
  },
  {
    tableName: "addresses",
    sequelize, // passing the `sequelize` instance is required
  }
);

Address.belongsTo(Person, { foreignKey: "personId", as: "address" });
Person.hasOne(Address, { foreignKey: "personId", as: "address" });

export default Address;

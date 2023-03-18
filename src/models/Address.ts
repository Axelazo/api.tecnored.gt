import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasOneSetAssociationMixin,
} from "sequelize";
import Department from "./Department";
import { sequelize } from "./index";
import Municipality from "./Municipality";
import Person from "./Person";

class Address extends Model<
  InferAttributes<Address>,
  InferCreationAttributes<Address>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare street: string;
  declare locality: string;
  declare municipalityId: ForeignKey<Municipality["id"]>;
  declare departmentId: ForeignKey<Department["id"]>;
  declare personId: ForeignKey<Person["id"]>;
  declare zipCode: string;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare setPerson: HasOneSetAssociationMixin<Person, number>;

  declare static associations: {
    person: Association<Address, Person>;
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
      allowNull: false,
      type: DataTypes.STRING,
    },
    street: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    locality: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    municipalityId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Municipality,
        key: "id",
      },
    },
    departmentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Department,
        key: "id",
      },
    },
    zipCode: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "addresses",
    sequelize, // passing the `sequelize` instance is required
  }
);

Address.belongsTo(Person, { foreignKey: "personId", as: "address" });
Person.hasOne(Address, { foreignKey: "personId", as: "address" });

export default Address;

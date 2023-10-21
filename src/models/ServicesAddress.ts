import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./index";
import Department from "./Department";
import Municipality from "./Municipality";
import Service from "./Service";
import Location from "./Location";

class ServicesAddress extends Model<
  InferAttributes<ServicesAddress>,
  InferCreationAttributes<ServicesAddress>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare street: string;
  declare locality: string;
  declare municipalityId: ForeignKey<Municipality["id"]>;
  declare departmentId: ForeignKey<Department["id"]>;
  declare zipCode: string;
  declare serviceId: ForeignKey<Service["id"]>;
  declare municipality?: NonAttribute<Municipality>;

  declare location?: NonAttribute<Location>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

ServicesAddress.init(
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
      allowNull: false,
      type: DataTypes.STRING,
    },
    locality: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    serviceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: ServicesAddress,
        key: "id",
      },
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
    tableName: "servicesAddresses",
    sequelize,
  }
);

export default ServicesAddress;

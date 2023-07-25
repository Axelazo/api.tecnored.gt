import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Client from "./Client";
import Service from "./Service";

class ServicesOwners extends Model<
  InferAttributes<ServicesOwners>,
  InferCreationAttributes<ServicesOwners>
> {
  declare id: CreationOptional<number>;
  declare clientId: ForeignKey<Client["id"]>;
  declare serviceId: ForeignKey<Service["id"]>;
  declare start: Date;
  declare end: CreationOptional<Date>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

ServicesOwners.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    clientId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Client,
        key: "id",
      },
    },
    serviceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Service,
        key: "id",
      },
    },
    start: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    end: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "servicesOwners",
    sequelize,
  }
);

export default ServicesOwners;

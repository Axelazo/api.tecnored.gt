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
import ServicesAddress from "./ServicesAddress";
import Status from "./Status";

class Service extends Model<
  InferAttributes<Service>,
  InferCreationAttributes<Service>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare serviceNumber: string;
  declare ipAddress: string;
  declare addressId: ForeignKey<ServicesAddress["id"]>;
  declare statusId: ForeignKey<Status["id"]>;
  declare establishmentId: ForeignKey<Establishment["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Service.init(
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
    serviceNumber: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    ipAddress: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    addressId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: ServicesAddress,
        key: "id",
      },
    },
    statusId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Status,
        key: "id",
      },
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
    tableName: "services",
    sequelize,
  }
);

Service.hasOne(ServicesAddress);
ServicesAddress.belongsTo(Service, {
  foreignKey: "addressId",
  as: "address",
});

//CHECK STATUS

Service.belongsTo(Establishment, {
  foreignKey: "establishmentId",
});
Establishment.hasMany(Service, {
  foreignKey: "establishmentId",
  as: "services",
});

export default Service;

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
import Plan from "./Plan";
import ServicesAddress from "./ServicesAddress";
import Status from "./Status";

class Service extends Model<
  InferAttributes<Service>,
  InferCreationAttributes<Service>
> {
  declare id: CreationOptional<number>;
  declare serviceNumber: string;
  declare ipAddress: string;
  declare planId: ForeignKey<Plan["id"]>;
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
    serviceNumber: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    ipAddress: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    planId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Plan,
        key: "id",
      },
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

Service.belongsTo(Establishment, {
  foreignKey: "establishmentId",
});
Establishment.hasMany(Service, {
  foreignKey: "establishmentId",
  as: "services",
});

Service.belongsTo(Plan, { foreignKey: "planId", as: "plan" });
Plan.hasMany(Service, { foreignKey: "planId", as: "services" });

Status.hasMany(Service, { foreignKey: "statusId", as: "services" });
Service.hasOne(Status);

export default Service;

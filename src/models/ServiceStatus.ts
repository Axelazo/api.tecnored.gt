import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Service from "./Service";
import Status from "./Status";

class ServiceStatus extends Model<
  InferAttributes<ServiceStatus>,
  InferCreationAttributes<ServiceStatus>
> {
  declare id: CreationOptional<number>;
  declare serviceId: ForeignKey<Service["id"]>;
  declare statusId: ForeignKey<Status["id"]>;
  declare start: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

ServiceStatus.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    statusId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Status,
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "servicestatuses",
    sequelize,
  }
);

export default ServiceStatus;

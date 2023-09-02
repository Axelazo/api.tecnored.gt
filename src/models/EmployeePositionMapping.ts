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
import Employee from "./Employee";
import Establishment from "./Establishment";
import Area from "./Area";
import Position from "./Position";

class EmployeePositionMapping extends Model<
  InferAttributes<EmployeePositionMapping>,
  InferCreationAttributes<EmployeePositionMapping>
> {
  declare id: CreationOptional<number>;
  declare employeeId: ForeignKey<Employee["id"]>;
  declare establishmentId: ForeignKey<Establishment["id"]>;
  declare areaId: ForeignKey<Area["id"]>;
  declare positionId: ForeignKey<Position["id"]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

EmployeePositionMapping.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    employeeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
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
    areaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Area,
        key: "id",
      },
    },
    positionId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Position,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "servicePlanMappings",
    sequelize,
  }
);

export default EmployeePositionMapping;

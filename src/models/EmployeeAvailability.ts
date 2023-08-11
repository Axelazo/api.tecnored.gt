import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Employee from "./Employee";

class EmployeeAvailability extends Model<
  InferAttributes<EmployeeAvailability>,
  InferCreationAttributes<EmployeeAvailability>
> {
  declare id: CreationOptional<number>;
  declare employeeId: ForeignKey<Employee>;
  declare available: boolean;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

EmployeeAvailability.init(
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
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "employeeAvailabilities",
    sequelize,
  }
);

export default EmployeeAvailability;

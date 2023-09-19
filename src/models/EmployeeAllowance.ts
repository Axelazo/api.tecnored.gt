import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Allowance from "./Allowance";
import PayrollItem from "./PayrollItem";

class EmployeeAllowance extends Model<
  InferAttributes<EmployeeAllowance>,
  InferCreationAttributes<EmployeeAllowance>
> {
  declare id: CreationOptional<number>;
  declare allowanceId: ForeignKey<Allowance["id"]>;
  declare payrollItemId: ForeignKey<PayrollItem["id"]>;
  declare amount: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

EmployeeAllowance.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    allowanceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Allowance,
        key: "id",
      },
    },
    payrollItemId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: PayrollItem,
        key: "id",
      },
    },
    amount: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "employeeAllowances",
    sequelize,
  }
);

export default EmployeeAllowance;

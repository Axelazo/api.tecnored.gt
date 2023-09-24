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
import Payroll from "./Payroll";
import Employee from "./Employee";
import EmployeeAllowance from "./EmployeeAllowance";
import EmployeeDeduction from "./EmployeeDeduction";

class PayrollItem extends Model<
  InferAttributes<PayrollItem>,
  InferCreationAttributes<PayrollItem>
> {
  declare id: CreationOptional<number>;
  declare payrollId: ForeignKey<Payroll["id"]>;
  declare month: string;
  declare salary: number;
  declare allowancesAmount: number;
  declare deductionsAmount: number;
  declare net: number;
  declare employeeId: ForeignKey<Employee["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare employeeAllowances: NonAttribute<EmployeeAllowance[]>;
  declare employeeDeductions: NonAttribute<EmployeeDeduction[]>;
}

PayrollItem.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    payrollId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Payroll,
        key: "id",
      },
    },
    month: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    salary: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    allowancesAmount: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    deductionsAmount: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    net: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    employeeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "payrollItems",
    sequelize,
  }
);

export default PayrollItem;

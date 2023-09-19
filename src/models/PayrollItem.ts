import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Payroll from "./Payroll";

class PayrollItem extends Model<
  InferAttributes<PayrollItem>,
  InferCreationAttributes<PayrollItem>
> {
  declare id: CreationOptional<number>;
  declare payrollId: ForeignKey<Payroll["id"]>;
  declare month: string;
  declare salary: number;
  declare allowances: number;
  declare deductions: number;
  declare net: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
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
    allowances: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    deductions: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    net: {
      allowNull: false,
      type: DataTypes.FLOAT,
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

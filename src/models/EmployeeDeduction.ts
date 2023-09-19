import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import PayrollItem from "./PayrollItem";
import Deduction from "./Deduction";

class EmployeeDeduction extends Model<
  InferAttributes<EmployeeDeduction>,
  InferCreationAttributes<EmployeeDeduction>
> {
  declare id: CreationOptional<number>;
  declare deductionId: ForeignKey<Deduction["id"]>;
  declare payrollItemId: ForeignKey<PayrollItem["id"]>;
  declare amount: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

EmployeeDeduction.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    deductionId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Deduction,
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

export default EmployeeDeduction;

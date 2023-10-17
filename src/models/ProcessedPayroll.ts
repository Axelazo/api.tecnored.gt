import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "./index";

class ProcessedPayroll extends Model<
  InferAttributes<ProcessedPayroll>,
  InferCreationAttributes<ProcessedPayroll>
> {
  declare id: CreationOptional<number>;
  declare payrollId: number;
  declare data: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

ProcessedPayroll.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    payrollId: {
      allowNull: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    data: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "processedPayrolls",
    sequelize,
  }
);

export default ProcessedPayroll;

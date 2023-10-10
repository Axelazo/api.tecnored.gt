import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./index";
import PayrollItem from "./PayrollItem";

class Payroll extends Model<
  InferAttributes<Payroll>,
  InferCreationAttributes<Payroll>
> {
  declare id: CreationOptional<number>;
  declare from: Date;
  declare to: Date;
  declare status: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare items: NonAttribute<PayrollItem[]>;
}

Payroll.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    from: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    to: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    status: {
      allowNull: false,
      type: DataTypes.TINYINT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "payrolls",
    sequelize,
  }
);

export default Payroll;

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

class Salary extends Model<
  InferAttributes<Salary>,
  InferCreationAttributes<Salary>
> {
  declare id: CreationOptional<number>;
  declare amount: number;
  declare employeeId: ForeignKey<Employee["id"]>;
  declare start: CreationOptional<Date>;
  declare end: CreationOptional<Date>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Salary.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    amount: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    employeeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
    },
    start: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    end: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },

  {
    tableName: "salaries",
    sequelize,
  }
);

export default Salary;

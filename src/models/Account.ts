import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import Bank from "./Bank";
import { sequelize } from "./index";
import Employee from "./Employee";

class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: CreationOptional<number>;
  declare number: CreationOptional<string>;
  declare bankId: ForeignKey<Bank["id"]>;
  declare employeeId: ForeignKey<Employee["id"]>;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare bank?: NonAttribute<Bank>;

  declare static associations: {
    employee: Association<Account, Employee>;
    bank: Association<Account, Bank>;
  };
}

//Pre encrypt account number

Account.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    number: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    bankId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Bank,
        key: "id",
      },
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
    tableName: "accounts",
    sequelize, // passing the `sequelize` instance is required
  }
);
Employee.hasOne(Account, { foreignKey: "employeeId", as: "account" });
Bank.hasMany(Account, { as: "accounts" });
Account.belongsTo(Bank, {
  foreignKey: "bankId",
  as: "bank",
});
Account.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employeeAccounts",
});

export default Account;

import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "./index";
import Account from "./Account";
import Employee from "./Employee";

class Bank extends Model<InferAttributes<Bank>, InferCreationAttributes<Bank>> {
  declare id: CreationOptional<number>;
  declare name: string;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare static associations: {
    accounts: Association<Bank, Account>;
  };
}

Bank.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "banks",
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Bank;

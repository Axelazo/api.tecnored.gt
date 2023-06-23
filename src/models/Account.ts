import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import Bank from "./Bank";
import { sequelize } from "./index";

class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  declare id: CreationOptional<number>;
  declare number: string;
  declare bankId: ForeignKey<Bank["id"]>;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare static associations: {
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "accounts",
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Account;

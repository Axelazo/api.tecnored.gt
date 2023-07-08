import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import User from "./User";

import { sequelize } from "./index";

export class Role extends Model<
  InferAttributes<Role>,
  InferCreationAttributes<Role>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare roleName: string;

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  //declare deletedAt: CreationOptional<Date>;

  declare static associations: {
    projects: Association<Role, User>;
  };
}

Role.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    roleName: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        isAlpha: {
          msg: "Name can only contain letters",
        },
        len: {
          args: [3, 255],
          msg: "Name needs to be at least 3 chars",
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    //deletedAt: DataTypes.DATE,
  },
  {
    tableName: "roles",
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Role;

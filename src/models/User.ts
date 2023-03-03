import {
  Association,
  HasManyGetAssociationsMixin,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  DataTypes,
} from "sequelize";
import bcrypt from "bcrypt";
import auth from "../config/auth";

import { sequelize } from "./index";
import Role from "./Role";

// 'projects' is excluded as it's not an attribute, it's an association.
class User extends Model<
  InferAttributes<User, { omit: "roles" }>,
  InferCreationAttributes<User, { omit: "roles" }>
> {
  // id can be undefined during creation when using `autoIncrement`
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string; // for nullable fields
  declare email: string;
  declare password: string;

  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  declare getRoles: HasManyGetAssociationsMixin<Role>; // Note the null assertions!

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  declare roles?: NonAttribute<Role[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare static associations: {
    projects: Association<User, Role>;
  };
}

User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    firstName: {
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
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isAlpha: {
          msg: "Last Name can only contain letters",
        },
        len: {
          args: [3, 255],
          msg: "Last Name needs to be at least 3 chars",
        },
      },
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email must be valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          ],
          msg: "Password must contain at least a minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        },
        len: {
          args: [8, 255],
          msg: "Password must contain at least 8 characters long",
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    hooks: {
      beforeCreate(user) {
        if (user.password) {
          user.password = bcrypt.hashSync(user.password, auth.rounds);
        }
      },
      beforeUpdate(user) {
        if (user.password) {
          user.password = bcrypt.hashSync(user.password, auth.rounds);
        }
      },
    },
    tableName: "users",
    sequelize, // passing the `sequelize` instance is required
  }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
User.belongsToMany(Role, {
  through: "usersRoles",
  as: "roles",
  foreignKey: "userId",
});

Role.belongsToMany(User, {
  through: "usersRoles",
  as: "users",
  foreignKey: "roleId",
});

export default User;

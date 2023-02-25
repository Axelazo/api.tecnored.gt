import { Model, Optional, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import { sequelize } from "./index";
import auth from "../config/auth";

interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

//We have to declare the AuthorCreationAttributes to
//tell Sequelize and TypeScript that the property id,
//in this case, is optional to be passed at creation time

type UserCreationAttributes = Optional<UserAttributes, "id">;

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const User = sequelize.define<UserInstance>(
  "User",
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
          msg: "Email must valid",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
  }
);

export default User;

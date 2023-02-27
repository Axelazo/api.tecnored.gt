import { Model, Optional, DataTypes, BuildOptions } from "sequelize";
import Role from "./Role";
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

type UserStatic = typeof Model & { associate: (models: any) => void } & {
  new (values?: Record<string, unknown>, options?: BuildOptions): UserInstance;
};

const User = <UserStatic>sequelize.define<UserInstance>(
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

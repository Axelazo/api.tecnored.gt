import { Model, Optional, DataTypes } from "sequelize";
import { sequelize } from "./index";
import auth from "../config/auth";

interface RoleAttributes {
  id: string;
  roleName: string;
}

//We have to declare the AuthorCreationAttributes to
//tell Sequelize and TypeScript that the property id,
//in this case, is optional to be passed at creation time

type RoleCreationAttributes = Optional<RoleAttributes, "id">;

interface UserInstance
  extends Model<RoleAttributes, RoleCreationAttributes>,
    RoleAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Role = sequelize.define<UserInstance>(
  "Role",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    roleName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isAlpha: {
          msg: "Role can only contain letters",
        },
        len: {
          args: [3, 255],
          msg: "Role needs to be at least 3 chars",
        },
      },
    },
  },
  {
    tableName: "roles",
  }
);

export default Role;

import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import Department from "./Department";
import { sequelize } from "./index";

class Municipality extends Model<
  InferAttributes<Municipality>,
  InferCreationAttributes<Municipality>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare departmentId: ForeignKey<Department["id"]>;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare static associations: {
    department: Association<Municipality, Department>;
  };
}

Municipality.init(
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
    departmentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Department,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "municipalities",
    sequelize, // passing the `sequelize` instance is required
  }
);

Municipality.belongsTo(Department, {
  foreignKey: "departmentId",
  as: "municipalities",
});
Department.hasMany(Municipality);

export default Municipality;

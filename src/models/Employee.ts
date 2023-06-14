import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasOneSetAssociationMixin,
  HasOneGetAssociationMixin,
} from "sequelize";
import { sequelize } from "./index";
import Person from "./Person";

class Employee extends Model<
  InferAttributes<Employee>,
  InferCreationAttributes<Employee>
> {
  declare id: CreationOptional<number>;
  declare employeeNumber: string;
  declare personId: ForeignKey<Person["id"]>;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare setPerson: HasOneSetAssociationMixin<Person, number>;
  declare getPerson: HasOneGetAssociationMixin<Person>;

  declare static associations: {
    person: Association<Employee, Person>;
  };
}

Employee.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    employeeNumber: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    personId: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "employees",
    sequelize, // passing the `sequelize` instance is required
  }
);

Employee.belongsTo(Person, { foreignKey: "personId", as: "person" });
Person.hasOne(Employee, { foreignKey: "personId", as: "employee" });

export default Employee;

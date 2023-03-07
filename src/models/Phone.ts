import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasOneSetAssociationMixin,
} from "sequelize";
import { sequelize } from "./index";
import Person from "./Person";

class Phone extends Model<
  InferAttributes<Phone>,
  InferCreationAttributes<Phone>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare number: string;
  declare personId: ForeignKey<Person["id"]>;
  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare setPerson: HasOneSetAssociationMixin<Person, number>;

  declare static associations: {
    person: Association<Phone, Person>;
  };
}

Phone.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    type: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    number: {
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
    tableName: "phones",
    sequelize, // passing the `sequelize` instance is required
  }
);

Phone.belongsTo(Person, { foreignKey: "personId", as: "phones" });
Person.hasMany(Phone, { foreignKey: "personId", as: "phones" });

export default Phone;

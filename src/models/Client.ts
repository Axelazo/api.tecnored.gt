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

class Client extends Model<
  InferAttributes<Client>,
  InferCreationAttributes<Client>
> {
  declare id: CreationOptional<number>;
  declare personId: ForeignKey<Person["id"]>;
  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare setPerson: HasOneSetAssociationMixin<Person, number>;
  declare getPerson: HasOneGetAssociationMixin<Person>;

  declare static associations: {
    person: Association<Client, Person>;
  };
}

Client.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
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
    tableName: "clients",
    sequelize, // passing the `sequelize` instance is required
  }
);

Client.belongsTo(Person, { foreignKey: "personId", as: "person" });
Person.hasOne(Client, { foreignKey: "personId", as: "client" });

export default Client;

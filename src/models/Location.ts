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
import Address from "./Address";
import { sequelize } from "./index";

class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  declare id: CreationOptional<number>;
  declare latitude: string;
  declare longitude: string;

  declare addressId: ForeignKey<Address["id"]>;
  // timestamps!
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare setAddress: HasOneSetAssociationMixin<Address, number>;

  declare static associations: {
    address: Association<Location, Address>;
  };
}

Location.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    latitude: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    longitude: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    addressId: {
      type: DataTypes.INTEGER,
      references: {
        model: Address,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "locations",
    sequelize, // passing the `sequelize` instance is required
  }
);

Location.belongsTo(Address, { foreignKey: "addressId", as: "location" });
Address.hasOne(Location, { foreignKey: "addressId", as: "location" });

export default Location;

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
import ServicesAddress from "./ServicesAddress";

class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  declare id: CreationOptional<number>;
  declare latitude: string;
  declare longitude: string;
  declare addressId: ForeignKey<ServicesAddress["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare setAddress: HasOneSetAssociationMixin<ServicesAddress, number>;
  declare getAddress: HasOneGetAssociationMixin<ServicesAddress>;

  declare static associations: {
    address: Association<Location, ServicesAddress>;
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
        model: ServicesAddress,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "serviceslocations",
    sequelize,
  }
);

Location.belongsTo(ServicesAddress, {
  foreignKey: "addressId",
  as: "location",
});
ServicesAddress.hasOne(Location);

export default Location;

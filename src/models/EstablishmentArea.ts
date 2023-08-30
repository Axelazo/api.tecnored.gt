import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Establishment from "./Establishment";
import Area from "./Area";

class EstablishmentArea extends Model<
  InferAttributes<EstablishmentArea>,
  InferCreationAttributes<EstablishmentArea>
> {
  declare id: CreationOptional<number>;
  declare establishmentId: ForeignKey<Establishment["id"]>;
  declare areaId: ForeignKey<Area["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

EstablishmentArea.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    establishmentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Establishment,
        key: "id",
      },
    },
    areaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Area,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "establishmentAreas",
    sequelize,
  }
);

export default EstablishmentArea;

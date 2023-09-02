import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Area from "./Area";
import Position from "./Position";

class AreaPosition extends Model<
  InferAttributes<AreaPosition>,
  InferCreationAttributes<AreaPosition>
> {
  declare id: CreationOptional<number>;
  declare areaId: ForeignKey<Area["id"]>;
  declare positionId: ForeignKey<Position["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

AreaPosition.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },

    areaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Area,
        key: "id",
      },
    },
    positionId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Position,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "areaPositions",
    sequelize,
  }
);

export default AreaPosition;

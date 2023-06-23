import {
  Association,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import Area from "./Department";
import { sequelize } from "./index";

class Position extends Model<
  InferAttributes<Position>,
  InferCreationAttributes<Position>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare areaId: ForeignKey<Area["id"]>;
  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare static associations: {
    area: Association<Position, Area>;
  };
}

Position.init(
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
    tableName: "positions",
    sequelize, // passing the `sequelize` instance is required
  }
);

export default Position;

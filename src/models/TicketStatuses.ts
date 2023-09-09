import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "./index";
import Ticket from "./Ticket";
import TicketStatus from "./TicketStatus";

class TicketStatuses extends Model<
  InferAttributes<TicketStatuses>,
  InferCreationAttributes<TicketStatuses>
> {
  declare id: CreationOptional<number>;
  declare ticketId: ForeignKey<Ticket["id"]>;
  declare statusId: ForeignKey<TicketStatus["id"]>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

TicketStatuses.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    ticketId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Ticket,
        key: "id",
      },
    },
    statusId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: TicketStatus,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "ticketStatuses",
    sequelize,
  }
);

export default TicketStatuses;

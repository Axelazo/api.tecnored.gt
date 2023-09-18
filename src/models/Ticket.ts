import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  NonAttribute,
} from "sequelize";
import { sequelize } from "./index";
import Service from "./Service";
import User from "./User";
import TicketStatuses from "./TicketStatuses";
import TicketReason from "./TicketReason";

class Ticket extends Model<
  InferAttributes<Ticket>,
  InferCreationAttributes<Ticket>
> {
  declare id: CreationOptional<number>;
  declare reasonId: ForeignKey<TicketReason["id"]>;
  declare customReason?: string;
  declare estimatedStart: CreationOptional<Date>;
  declare estimatedFinish: CreationOptional<Date>;
  declare description?: string;
  declare priority: number;
  declare serviceId: ForeignKey<Service["id"]>;
  declare creatorId: ForeignKey<User["id"]>;

  declare statuses?: NonAttribute<TicketStatuses[]>;
  declare status?: NonAttribute<TicketStatuses>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

Ticket.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    priority: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    reasonId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: TicketReason,
        key: "id",
      },
    },
    customReason: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    estimatedStart: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    estimatedFinish: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    description: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    serviceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Service,
        key: "id",
      },
    },
    creatorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "tickets",
    sequelize,
  }
);

export default Ticket;

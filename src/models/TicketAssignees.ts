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
import Ticket from "./Ticket";
import Employee from "./Employee";

class TicketAssignees extends Model<
  InferAttributes<TicketAssignees>,
  InferCreationAttributes<TicketAssignees>
> {
  declare id: CreationOptional<number>;
  declare ticketId: ForeignKey<Ticket>;
  declare assigneeId: ForeignKey<Employee>;

  // timestamps!
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare tickets?: NonAttribute<Ticket[]>;
  declare employees?: NonAttribute<Employee[]>;
  declare ticket?: NonAttribute<Ticket>;
  declare employee?: NonAttribute<Employee>;
}

TicketAssignees.init(
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
    assigneeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    tableName: "ticketAssignees",
    sequelize,
  }
);

export default TicketAssignees;

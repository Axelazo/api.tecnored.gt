import { Request } from "express";
import User from "../../models/User";

//* Define an interface that extends the Request interface to include the `user` property
// TODO: Research about Sequelize DTOs to handle user roles

export interface AuthRequest extends Request {
  user?: typeof User;
}

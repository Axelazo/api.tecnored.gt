import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import Role from "../models/Role";
import { Error } from "sequelize";
import { AuthRequest } from "../ts/interfaces/app-interfaces";

// Get one user by ID
export const getUserById = async (
  request: AuthRequest,
  response: Response,
  next: NextFunction
) => {
  const { id } = request.params;
  User.findByPk(id, { include: ["roles"] })
    .then((user) => {
      if (!user) {
        response.status(404).json({ error: "User not found" });
      } else {
        const { password, ...userWithoutPassword } = user.toJSON();
        response.json(userWithoutPassword);
      }
    })
    .catch((error: Error) => {
      response.status(500).json({ error: `Server error: ${error.message}` });
    });
};

export const getAllUsers = async (request: Request, response: Response) => {
  User.findAll({
    include: ["roles"],
  })
    .then((users) => {
      if (!users) {
        response.status(404).json({ error: "Users not found" });
      } else {
        response.json(users);
        console.log(JSON.stringify(users[0]));
      }
    })
    .catch((error: Error) => {
      response.status(500).json({ error: `Server error: ${error.message}` });
    });
};

export default { getAllUsers, getUserById };

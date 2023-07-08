import { Request, Response } from "express";
import User from "../models/User";
import { Error } from "sequelize";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import Role from "../models/Role";

// Get one user by ID
export const getUserById = async (request: AuthRequest, response: Response) => {
  const { id } = request.params;
  User.findByPk(id, {
    include: ["roles"],
  })
    .then((user) => {
      if (!user) {
        response.status(404).json({ message: "User not found" });
      } else {
        /*         const { password, ...userWithoutPassword } = user.toJSON();
         */ response.json(user);
      }
    })
    .catch((error: Error) => {
      response.status(500).json({ error: `Server error: ${error.message}` });
    });
};

export const getAllUsers = async (request: Request, response: Response) => {
  User.findAll({
    attributes: ["firstName", "lastName", "email"],
    include: {
      model: Role,
      as: "roles",
      through: {
        attributes: [],
      },
    },
  })
    .then((users) => {
      if (!users) {
        response.status(404).json({ message: "Users not found" });
      } else {
        response.json(users);
      }
    })
    .catch((error: Error) => {
      response.status(500).json({ message: `Server error: ${error.message}` });
    });
};

export default { getAllUsers, getUserById };

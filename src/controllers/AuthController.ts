import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import auth from "../config/auth";
import bcrypt from "bcrypt";
import User from "../models/User";
import Role from "../models/Role";

function signIn(request: Request, response: Response) {
  const { email, password } = request.body;

  User.findOne({
    where: {
      email: email,
    },
    attributes: ["id", "firstName", "lastName", "password", "email"],
    include: {
      model: Role,
      as: "roles",
      through: {
        attributes: [],
      },
    },
  })
    .then((user) => {
      if (!user) {
        response.status(400).json({ statusMessage: "User not found" });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({ user: user }, auth.secret, {
            expiresIn: auth.expires,
          });

          const { id, firstName, lastName, email, roles } = user;

          response.status(200).json({
            data: {
              id,
              firstName,
              lastName,
              email,
              roles,
              token,
            },
          });
        } else {
          response
            .status(401)
            .json({ statusMessage: "Wrong email or password" });
        }
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(500).json(error);
    });
}

//Registration for new user
function signUp(request: Request, response: Response) {
  const { firstName, lastName, email, password } = request.body;

  Promise.all([
    User.create({
      firstName,
      lastName,
      email,
      password,
    })
      .then((user) => {
        Role.findAll({
          where: {
            roleName: "user",
          },
        }).then((role) => {
          user.setRoles(role);
        });
        const token = jwt.sign({ user: user }, auth.secret, {
          expiresIn: auth.expires,
        });

        const { id, firstName, lastName, roles } = user;

        response.json({
          id,
          firstName,
          lastName,
          roles,
          token: token,
        });
      })
      .catch((error) => {
        response.status(500).json(error);
      }),
  ]);
}

export default { signIn, signUp };

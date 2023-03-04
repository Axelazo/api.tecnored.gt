import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auth from "../config/auth";
import User from "../models/User";
import Role from "../models/Role";

function signIn(request: Request, response: Response) {
  const { email, password } = request.body;

  User.findOne({
    where: {
      email: email,
    },
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
        response.status(400).json({ message: "Usuario no encontrado" });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          const { id, firstNames, lastNames, email, roles } = user;

          const token = jwt.sign({ user: user }, auth.secret, {
            expiresIn: auth.expires,
          });

          response.status(200).json({
            data: {
              id,
              firstNames,
              lastNames,
              email,
              roles,
              token,
            },
          });
        } else {
          response
            .status(401)
            .json({ message: "Correo electrónico o contraseña incorrecta" });
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
  const { firstNames, lastNames, email, password } = request.body;

  Promise.all([
    User.create({
      firstNames,
      lastNames,
      email,
      password,
    })
      .then((user) => {
        Role.findAll({
          where: {
            roleName: "admin",
          },
        }).then((role) => {
          user.setRoles(role);
        });
        const token = jwt.sign({ user: user }, auth.secret, {
          expiresIn: auth.expires,
        });

        const { id, firstNames, lastNames, roles } = user;

        response.json({
          id,
          firstNames,
          lastNames,
          roles,
          token: token,
        });
      })
      .catch((error) => {
        response.status(500).json({ message: "Error!" });
      }),
  ]);
}

export default { signIn, signUp };

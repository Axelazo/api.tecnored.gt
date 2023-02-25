import { Request, Response, Errback } from "express";
import jwt from "jsonwebtoken";
import auth from "../config/auth";
import bcrypt from "bcrypt";

import User from "../models/User";

function signIn(request: Request, response: Response) {
  const { email, password } = request.body;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        response.status(400).json({ message: "User not found" });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({ user: user }, auth.secret, {
            expiresIn: auth.expires,
          });

          const { id, firstName, lastName } = user;

          response.json({
            id,
            firstName,
            lastName,
            token: token,
          });
        } else {
          response.status(401).json();
        }
      }
    })
    .catch((error) => {
      response.status(500).json();
    });
}

//Registration for new user
function signUp(request: Request, response: Response) {
  User.create({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    password: request.body.password,
  })
    .then((user) => {
      const token = jwt.sign({ user: user }, auth.secret, {
        expiresIn: auth.expires,
      });

      const { id, firstName, lastName } = user;

      response.json({
        id,
        firstName,
        lastName,
        token: token,
      });
    })
    .catch((error) => {
      response.status(500).json(error);
    });
}

export default { signIn, signUp };

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auth from "../config/auth";
import { User, Role, Employee } from "../models/Relationships";

/* function signIn(request: Request, response: Response) {
  const { email, password } = request.body;

  User.findOne({
    where: {
      email: email,
    },
    include: [
      {
        model: Role,
        as: "roles",
        through: {
          attributes: [],
        },
      },
      {
        model: Employee,
        as: "employee",
      },
    ],
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
} */

async function signIn(request: Request, response: Response) {
  const { email, password } = request.body;

  if (!email) {
    return response
      .status(409)
      .json({ message: "El correo electrónico es requerido" });
  }

  if (!password) {
    return response.status(409).json({ message: "La contraseña requerida" });
  }

  try {
    const user = await User.findOne({
      where: {
        email,
      },
      include: [
        {
          model: Role,
          as: "roles",
          through: {
            attributes: [],
          },
        },
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "employeeNumber"],
        },
      ],
    });

    if (!user) {
      return response
        .status(401)
        .json({ message: "Correo electrónico o contraseña incorrecta" });
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return response
        .status(401)
        .json({ message: "Correo electrónico o contraseña incorrecta" });
    }

    const { id, firstNames, lastNames, roles, employee } = user;

    const token = jwt.sign({ user: user }, auth.secret, {
      expiresIn: auth.expires,
    });

    return response.status(200).json({
      data: {
        id,
        firstNames,
        lastNames,
        email,
        roles,
        employeeId: employee?.id || null,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error });
  }
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
            roleName: "user",
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
        console.log(error);
        response.status(500).json({ message: "Error!" });
      }),
  ]);
}

export default { signIn, signUp };

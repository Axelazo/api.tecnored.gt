import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auth from "../config/auth";
import { User, Role, Employee } from "../models/Relationships";

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

// Updated changePassword function
/*
async function changePassword(request: Request, response: Response) {
  const { currentPassword, newPassword } = request.body;
  const token = request.headers.authorization;

  if (!token) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, auth.secret);

    if (!decodedToken.user || !decodedToken.user.id) {
      return response.status(401).json({ message: "Invalid token format" });
    }

    const userId = decodedToken.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const currentPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!currentPasswordMatch) {
      return response.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash the new password before updating it
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await user.update({ password: newPasswordHash });

    return response.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Error changing password" });
  }
}
 */
export default { signIn, signUp /*changePassword*/ };

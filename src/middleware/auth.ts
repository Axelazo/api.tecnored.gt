import { Response, NextFunction } from "express";
import authConfig from "../config/auth";
import jwt from "jsonwebtoken";

import {
  AuthRequest,
  RoleInterface,
  UserInterface,
} from "../ts/interfaces/app-interfaces";

export function authenticate(
  request: AuthRequest,
  response: Response,
  next: NextFunction
) {
  if (!request.headers.authorization) {
    response.status(401).json();
  } else {
    const token = request.headers.authorization.split(" ")[1];
    jwt.verify(token, authConfig.secret, (error, decoded) => {
      if (error) {
        response.status(500).json({
          message: "La autenticación falló, token inválido",
        });
      } else {
        const { user } = decoded as any; // this fucking line took 2 hours
        request.user = user as UserInterface;
        next();
      }
    });
  }
}

export function checkRoles(roles: RoleInterface[]) {
  return function (
    request: AuthRequest,
    response: Response,
    next: NextFunction
  ) {
    const user = request.user;
    const userRoles = user?.roles;

    if (!user) {
      response.status(401).json({
        message: "No se encontró el usuario en la solicitud.",
      });
    } else if (!userRoles) {
      response.status(401).json({
        message: "El usuario no tiene roles definidos.",
        user,
      });
    } else {
      const hasPermission = roles.some((role) =>
        userRoles.some((userRole) => userRole.roleName === role.roleName)
      );
      if (!hasPermission) {
        response.status(403).json({
          message: "No tienes permiso suficiente para acceder a este recurso.",
        });
      } else {
        next();
      }
    }
  };
}

export default { authenticate, checkRoles };

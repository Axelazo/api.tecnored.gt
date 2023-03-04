import { Response, NextFunction } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import authConfig from "../config/auth";
import jwt from "jsonwebtoken";
import User from "../models/User";

function auth(request: AuthRequest, response: Response, next: NextFunction) {
  if (!request.headers.authorization) {
    response.status(401).json();
  } else {
    const token = request.headers.authorization.split(" ")[1];
    jwt.verify(token, authConfig.secret, (error, decoded) => {
      if (error) {
        response.status(500).json();
      } else {
        request.user = <User>decoded;
        next();
      }
    });
  }
}

export default auth;

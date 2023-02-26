import { Request, Response, NextFunction } from "express";
import authConfig from "../config/auth";
import jwt from "jsonwebtoken";

function auth(request: Request, response: Response, next: NextFunction) {
  if (!request.headers.authorization) {
    response.status(401).json();
  } else {
    const token = request.headers.authorization.split(" ")[1];
    jwt.verify(token, authConfig.secret, (error, decoded) => {
      if (error) {
        response.status(500).json();
      } else {
        //request.user = decoded;
        next();
      }
    });
  }
}

export default auth;

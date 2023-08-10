import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";

export class CustomError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export const errorMiddleware = (
  error: CustomError,
  request: AuthRequest,
  response: Response
) => {
  if (error instanceof CustomError) {
    response.status(error.code).json(error.message);
    return;
  } else {
    const message = `La transacción falló: ${error}`;
    response.status(500).json({ message });
    return;
  }
};

export default { errorMiddleware };

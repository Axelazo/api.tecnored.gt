import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";

const checkOnline = async (request: AuthRequest, response: Response) => {
  try {
    const randomNumber = Math.random(); // Generar número aleatorio entre 0 y 1

    if (randomNumber < 0.95) {
      // Devolver status code 200 el 99% de las veces
      response.status(200).json({ message: "Success!" });
    } else {
      // Devolver status code 500 el 1% de las veces
      throw new Error("Internal Server Error");
    }
  } catch (error) {
    response.status(500).json({ message: "Error!" });
  }
};

export default { checkOnline };

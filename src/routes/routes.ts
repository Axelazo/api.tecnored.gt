import express, { Router, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
const router: Router = express.Router();

//Controllers

//Home
router.get("/", (request: Request, response: Response) => {
  console.log(`[server]: ⚡️ Te amo mi amor, mi chiquitita preciosa ❤️❤️❤️`);
  return response.json({ hola: "mundo" });
});

//Auth
router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

export default router;

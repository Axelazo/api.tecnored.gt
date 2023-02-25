import express, { Router, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import auth from "../middleware/auth";

//* Main router
const router: Router = express.Router();

//* Middlewares

//* Controllers

//* Home
router.get("/", (request: Request, response: Response) => {
  console.log(`[server]: ⚡️ Te amo mi amor, mi chiquitita preciosa ❤️❤️❤️`);
  return response.json({
    data: "⚡️ Te amo mi amor, mi chiquitita preciosa ❤️❤️❤️",
  });
});

//* Auth
router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

export default router;

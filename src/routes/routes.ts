import express, { Router, Request, Response, request, response } from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import auth from "../middleware/auth";

//* Main router
const router: Router = express.Router();

//* Middlewares

//* Controllers
/* router.get("/user/:id", auth, (request, response, next) => {
  console.log(`[server]: GET request to /user ID: ${request.params.id}`);
  response.json({ id: request.params.id });
  next();
}); */
router.get("/users/", auth, UserController.getAllUsers);
router.get("/users/:id", auth, UserController.getUserById);

//* Home
router.get("/", (request, response) => {
  console.log(`[server]: ⚡️ Te amo mi amor, mi chiquitita preciosa ❤️❤️❤️`);
  return response.json({
    data: "⚡️ Te amo mi amor, mi chiquitita preciosa ❤️❤️❤️",
  });
});

//* Auth
router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

export default router;

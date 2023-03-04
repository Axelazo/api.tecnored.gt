import express, { Router } from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import ClientController from "../controllers/ClientController";
import auth from "../middleware/auth";

//* Main router
const router: Router = express.Router();

//* Middlewares

//* Controllers
router.get("/clients", ClientController.getAllClients);
router.post("/clients/create", ClientController.createClient);

router.get("/users/", auth, UserController.getAllUsers);
router.get("/users/:id", auth, UserController.getUserById);

//* Auth
router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

export default router;

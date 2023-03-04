import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router: Router = Router();

router.post("/signin", AuthController.signIn);
router.post("/signup", AuthController.signUp);

export default router;

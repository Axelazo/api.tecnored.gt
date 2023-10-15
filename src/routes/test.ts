import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import TestController from "../controllers/TestController";

const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();

router.get("/", TestController.testEndpointForDevelopmentPurposes);

export default router;

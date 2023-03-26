import { Router } from "express";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import DashboardController from "../controllers/DashboardController";
import Auth from "../middleware/auth";

const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();

router.get(
  "/",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  DashboardController.getDashboardData
);

export default router;

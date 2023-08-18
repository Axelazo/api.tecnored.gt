import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import MockController from "../controllers/MockController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.get("/check-online", MockController.checkOnline);

export default router;

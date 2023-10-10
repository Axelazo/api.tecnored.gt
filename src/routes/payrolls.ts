import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import PayrollController from "../controllers/PayrollController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.get("/", PayrollController.getAllPayrolls);
router.get("/:id", PayrollController.getPayrollById);

export default router;

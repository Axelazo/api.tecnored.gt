import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import EmployeeAllowancesController from "../controllers/EmployeeAllowancesController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.post("/create", EmployeeAllowancesController.createEmployeeAllowance);
router.get("/:id", EmployeeAllowancesController.getAllEmployeeAllowances);
router.get(
  "/amount",
  EmployeeAllowancesController.getAllEmployeesAllowancesAmount
);
router.delete(
  "/delete/:id",
  EmployeeAllowancesController.deleteEmployeeAllowance
);

export default router;

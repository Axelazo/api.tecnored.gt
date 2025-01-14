import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import EmployeeDeductionController from "../controllers/EmployeeDeductionController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.post("/create", EmployeeDeductionController.createEmployeeDeduction);
router.get("/:id", EmployeeDeductionController.getAllEmployeeDeductions);
router.get(
  "/amount",
  EmployeeDeductionController.getAllEmployeesDeductionsAmount
);
router.delete(
  "/delete/:id",
  EmployeeDeductionController.deleteEmployeeDeduction
);

export default router;

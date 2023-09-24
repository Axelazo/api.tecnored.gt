import { Router } from "express";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import EmployeeAllowancesController from "../controllers/EmployeeAllowancesController";
import EmployeeDeductionController from "../controllers/EmployeeDeductionController";
import ClientController from "../controllers/ClientController";

const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();

router.get(
  "/employees/allowances/amount",
  EmployeeAllowancesController.getAllEmployeesAllowancesAmount
);

router.get(
  "/employees/deductions/amount",
  EmployeeDeductionController.getAllEmployeesDeductionsAmount
);

router.get("/clients/count", ClientController.getClientsCount);

export default router;

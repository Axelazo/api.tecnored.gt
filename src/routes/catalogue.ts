import { Router } from "express";
import DepartmentController from "../controllers/DepartmentController";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";

const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
  { roleName: "user" },
];

const router: Router = Router();

router.get(
  "/departments",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  DepartmentController.getAllDepartments
);

router.get(
  "/departments/:id/municipalities",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  DepartmentController.getAllMunicipalitiesFromDepartment
);

export default router;

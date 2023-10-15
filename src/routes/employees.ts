import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import EmployeeController from "../controllers/EmployeeController";
import upload from "../middleware/upload";

const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const allowedRolesWithWorker: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
  { roleName: "worker" },
];

const router: Router = Router();

router.get(
  "/",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  EmployeeController.getAllEmployees
);

router.get(
  "/:id",
  Auth.authenticate,
  Auth.checkRoles(allowedRolesWithWorker),
  EmployeeController.getEmployeeById
);

router.get(
  "/positions/:positionName",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  EmployeeController.getAllEmployeesWithPosition
);

router.post(
  "/create",
  upload.fields([
    { name: "dpiFront", maxCount: 1 },
    { name: "dpiBack", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  EmployeeController.createEmployee
);

router.put(
  "/update/:id",
  upload.fields([
    { name: "dpiFront", maxCount: 1 },
    { name: "dpiBack", maxCount: 1 },
    { name: "profilePicture", maxCount: 1 },
  ]),
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  EmployeeController.updateEmployee
);

router.delete(
  "/delete/:id",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  EmployeeController.deleteEmployee
);

export default router;

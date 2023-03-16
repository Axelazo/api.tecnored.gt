import { Router } from "express";
import Auth from "../middleware/auth";
import upload from "../middleware/upload";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import ClientController from "../controllers/ClientController";

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
  ClientController.getAllClients
);

router.get(
  "/:id",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  ClientController.getClientById
);

router.post(
  "/create",
  upload.fields([
    { name: "dpiFront", maxCount: 1 },
    { name: "dpiBack", maxCount: 1 },
  ]),
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  ClientController.createClient
);

router.put(
  "/update/:id",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  ClientController.updateClient
);

router.delete(
  "/delete/:id",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  ClientController.deleteClient
);

export default router;

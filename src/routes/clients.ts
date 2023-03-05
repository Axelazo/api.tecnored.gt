import { Router } from "express";
import Auth from "../middleware/auth";
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

router.post(
  "/create",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  ClientController.createClient
);

router.put(
  "/create",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  ClientController.updateClient
);

export default router;

import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import ServiceController from "../controllers/ServiceController";

const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.post("/create", ServiceController.createServiceForClient);
router.get(
  "/client/:clientId",
  /*   Auth.authenticate,
  Auth.checkRoles(allowedRoles), */
  ServiceController.getAllServicesOfClient
);

router.get(
  "/area",
  /*   Auth.authenticate,
  Auth.checkRoles(allowedRoles), */
  ServiceController.getAllServicesInGeographicArea
);

router.get(
  "/:id",
  /*   Auth.authenticate,
  Auth.checkRoles(allowedRoles), */
  ServiceController.getServiceWithId
);

export default router;

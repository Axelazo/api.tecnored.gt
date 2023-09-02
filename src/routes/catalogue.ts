import { Router } from "express";
import DepartmentController from "../controllers/DepartmentController";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import EstablishmentController from "../controllers/EstablishmentController";
import BankController from "../controllers/BankController";

const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
  { roleName: "user" },
];

const router: Router = Router();

//Departments and Municipalities
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

//Establishments, Areas and Positions
router.get("/establishments", EstablishmentController.getAllEstablishments);
router.get("/areas", EstablishmentController.getAllAreas);
router.get("/positions", EstablishmentController.getAllPositions);

// Establishment and and relationships
router.get(
  "/establishments/:id/areas",
  EstablishmentController.getAllAreasFromEstablishment
);

router.post(
  "/establishments/relationships/areas/create/",
  EstablishmentController.createEstablishmentAreaRelationship
);
router.delete(
  "/establishments/relationships/areas/delete/",
  EstablishmentController.deleteEstablishmentAreaRelationship
);

router.get(
  "/establishments/:establishmentId/areas/:areaId/positions",
  EstablishmentController.getAllPositionsFromEstablishmentArea
);

router.post(
  "/establishments/relationships/areas/relationships/positions/create",
  EstablishmentController.createEstablishmentAreaPositionRelationship
);

//Banks and Accounts
router.get("/banks/create", BankController.createBank);
router.get("/banks", BankController.getAllBanks);
router.put("/banks/update/:id", BankController.updateBank);
router.delete("/banks/delete/:id", BankController.deleteBank);
router.get("/banks/:id/accounts", BankController.getAllAccountsFromBank);

export default router;

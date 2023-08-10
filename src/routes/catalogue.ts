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

router.get(
  "/establishments/:id/areas",
  EstablishmentController.getAllAreasFromEstablishment
);

router.get(
  "/establishment/area/:id/positions",
  EstablishmentController.getAllPositionsFromArea
);

//Banks and Accounts
router.get("/banks/create", BankController.createBank);
router.get("/banks", BankController.getAllBanks);
router.put("/banks/update/:id", BankController.updateBank);
router.delete("/banks/delete/:id", BankController.deleteBank);
router.get("/banks/:id/accounts", BankController.getAllAccountsFromBank);

export default router;

import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import AllowanceController from "../controllers/AllowanceController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.post("/create", AllowanceController.createAllowance);
router.get("/", AllowanceController.getAllAllowances);
router.get("/:id", AllowanceController.getAllowanceById);
router.put("/update/:id", AllowanceController.updateAllowance);
router.delete("/delete/:id", AllowanceController.deleteAllowance);

export default router;

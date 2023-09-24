import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import DeductionController from "../controllers/DeductionController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.post("/create", DeductionController.createDeduction);
router.get("/", DeductionController.getAllDeductions);
router.get("/:id", DeductionController.getDeductionById);
router.put("/update/:id", DeductionController.updateDeduction);
router.delete("/delete/:id", DeductionController.deleteDeduction);

export default router;

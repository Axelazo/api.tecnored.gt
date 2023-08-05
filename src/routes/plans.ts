import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import PlanController from "../controllers/PlanController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.get("/", PlanController.getAllPlans);
router.get("/:id", PlanController.getPlanById);
router.post("/create", PlanController.createPlan);
router.put("/update/:id", PlanController.updatePlan);
router.delete("/delete/:id", PlanController.deletePlan);

export default router;

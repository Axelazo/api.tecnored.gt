import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import RouterController from "../controllers/RouterController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();
router.post("/create", RouterController.createRouter);
router.get("/", RouterController.getAllRouters);
router.get("/:id", RouterController.getRouterById);
router.put("/update/:id", RouterController.updateRouter);
router.delete("/delete/:id", RouterController.deleteRouter);

export default router;

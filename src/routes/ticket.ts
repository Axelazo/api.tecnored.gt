import { Router } from "express";
import Auth from "../middleware/auth";
import { RoleInterface } from "../ts/interfaces/app-interfaces";
import TicketController from "../controllers/TicketController";
const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

const router: Router = Router();

router.get("/", TicketController.getAllTickets);
router.get("/:id", TicketController.getTicketById);
router.get("/employee", TicketController.getAllTicketsForEmployee);
router.post("/create", TicketController.createTicketForService);
router.put("/:id/update", TicketController.updateTicketStatus);
router.delete("/delete/:id", TicketController.deleteTicket);

export default router;

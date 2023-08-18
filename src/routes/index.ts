import express, { Router } from "express";
import dashboard from "./dashboard";
import clientRoutes from "./clients";
import plans from "./plans";
import ticketRoutes from "./ticket";
import routerRoutes from "./routers";

import employeRoutes from "./employees";
import serviceRoutes from "./services";
import catalogue from "./catalogue";
import authRoutes from "./auth";
import mockRoutes from "./mock";

const router: Router = express.Router();

//app routes
router.use("/dashboard", dashboard);
router.use("/clients", clientRoutes);
router.use("/employees", employeRoutes);
router.use("/plans", plans);
router.use("/services", serviceRoutes);
router.use("/tickets", ticketRoutes);
router.use("/routers", routerRoutes);
router.use(authRoutes);

//catalogue routes
router.use("/", catalogue);

// Mock routes
router.use("/mock", mockRoutes);

export default router;

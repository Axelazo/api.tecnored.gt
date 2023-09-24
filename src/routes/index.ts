import express, { Router } from "express";
import dashboardRoutes from "./dashboard";
import clientRoutes from "./clients";
import plans from "./plans";
import ticketRoutes from "./ticket";
import routerRoutes from "./routers";
import employeRoutes from "./employees";
import serviceRoutes from "./services";
import allowancesRoutes from "./allowances";
import deductionsRoutes from "./deductions";
import employeeAllowancesRoutes from "./employeeAllowances";
import employeeDeductionsRoutes from "./employeeDeductions";
import catalogue from "./catalogue";
import authRoutes from "./auth";
import mockRoutes from "./mock";

const router: Router = express.Router();

//app routes
router.use("/dashboard", dashboardRoutes);
router.use("/clients", clientRoutes);
router.use("/employees", employeRoutes);
router.use("/plans", plans);
router.use("/services", serviceRoutes);
router.use("/tickets", ticketRoutes);
router.use("/routers", routerRoutes);
router.use(authRoutes);

// allowances, deductions routes
router.use("/allowances", allowancesRoutes);
router.use("/deductions", deductionsRoutes);
router.use("/allowances/employees", employeeAllowancesRoutes);
router.use("/deductions/employees", employeeDeductionsRoutes);

// Mock routes
router.use("/mock", mockRoutes);

export default router;

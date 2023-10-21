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
import payrollsRoutes from "./payrolls";
import authRoutes from "./auth";
import mockRoutes from "./mock";
import catalogueRoutes from "./catalogue";
import testRoutes from "./test";
import imageRoutes from "./image";

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
router.use("/payrolls", payrollsRoutes);
router.use("/allowances", allowancesRoutes);
router.use("/deductions", deductionsRoutes);
router.use("/allowances/employees", employeeAllowancesRoutes);
router.use("/deductions/employees", employeeDeductionsRoutes);

// catalogue routes
router.use(catalogueRoutes);

// Mock routes
router.use("/mock", mockRoutes);

// Test route
router.use("/test", testRoutes);

router.use(imageRoutes);

export default router;

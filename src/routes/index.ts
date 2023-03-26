import express, { Router } from "express";
import dashboard from "./dashboard";
import clientRoutes from "./clients";
import catalogue from "./catalogue";
import authRoutes from "./auth";

const router: Router = express.Router();

//app routes
router.use("/dashboard", dashboard);
router.use("/clients", clientRoutes);
router.use(authRoutes);

//catalogue routes
router.use("/", catalogue);

export default router;

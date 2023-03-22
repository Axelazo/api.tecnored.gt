import express, { Router } from "express";
import clientRoutes from "./clients";
import catalogue from "./catalogue";
import authRoutes from "./auth";

const router: Router = express.Router();

//app routes
router.use("/clients", clientRoutes);
router.use(authRoutes);

//catalogue routes
router.use("/", catalogue);

export default router;

import express, { Router } from "express";
import clientRoutes from "./clients";
import authRoutes from "./auth";

const router: Router = express.Router();

router.use("/clients", clientRoutes);
router.use(authRoutes);

export default router;

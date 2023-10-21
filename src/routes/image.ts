import * as path from "path";
import express, { Router } from "express";
import Auth from "../middleware/auth";
import ImageController from "../controllers/ImageController";
import Role from "../models/Role";
import { RoleInterface } from "../ts/interfaces/app-interfaces";

const router: Router = Router();

const allowedRoles: RoleInterface[] = [
  {
    roleName: "admin",
  },
  { roleName: "operator" },
];

router.get(
  "/protected/images/:image",
  Auth.authenticate,
  Auth.checkRoles(allowedRoles),
  ImageController.getImage
);

export default router;

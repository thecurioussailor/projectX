import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";
export const adminRouter = Router();

adminRouter.post("/signin", adminController.adminSignin);
adminRouter.get("/profile", authenticate, authorizeAdmin, adminController.adminProfile);

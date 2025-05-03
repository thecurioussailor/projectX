import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/signin", authController.signin);
authRouter.post("/update-password", authenticate, authController.updatePassword);

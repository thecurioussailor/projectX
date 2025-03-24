import { Router } from "express";
import * as authController from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/signup", authController.signup);
authRouter.post("/signin", authController.signin);

import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as salesController from "../controllers/salesController.js";

export const salesRouter = Router();

salesRouter.get("/", authenticate, salesController.getAllSales);

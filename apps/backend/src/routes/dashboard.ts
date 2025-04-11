import { Router } from "express";
import { getDashboardStats, getDailySalesStats } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/auth.js";

export const dashboardRouter = Router();

dashboardRouter.get("/stats", authenticate, getDashboardStats);
dashboardRouter.get("/daily-sales", authenticate, getDailySalesStats);

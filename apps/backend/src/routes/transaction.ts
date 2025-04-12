import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as transactionController from "../controllers/transactionController.js";

export const transactionRouter = Router();

transactionRouter.get("/", authenticate, transactionController.getTransactions);



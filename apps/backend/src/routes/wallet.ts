import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as walletController from "../controllers/walletController.js";
export const walletRouter = Router();

walletRouter.get("/", authenticate, walletController.getUserWallet);
walletRouter.post("/withdraw", authenticate, walletController.createWithdrawalRequest);
walletRouter.get("/withdrawals", authenticate, walletController.getWithdrawalRequests);
walletRouter.get("/transactions", authenticate, walletController.getWalletTransactions);



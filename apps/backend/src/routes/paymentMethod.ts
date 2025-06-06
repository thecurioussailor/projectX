import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as paymentMethodController from "../controllers/paymentMethodController.js";

export const paymentMethodRouter = Router();

paymentMethodRouter.post("/", authenticate, paymentMethodController.createPaymentMethod);
paymentMethodRouter.get("/", authenticate, paymentMethodController.getUserPaymentMethods);
paymentMethodRouter.get("/:paymentMethodId", authenticate, paymentMethodController.getUserPaymentMethodById);
paymentMethodRouter.put("/:paymentMethodId", authenticate, paymentMethodController.updatePaymentMethod);
paymentMethodRouter.delete("/:paymentMethodId", authenticate, paymentMethodController.deletePaymentMethod);
